import { RemovalPolicy } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import {
  IntegrationPattern,
  JsonPath,
  LogLevel,
  Map,
  StateMachine,
  StateMachineType,
} from "aws-cdk-lib/aws-stepfunctions";
import {
  CallAwsService,
  CallAwsServiceProps,
} from "aws-cdk-lib/aws-stepfunctions-tasks";
import { Construct } from "constructs";
import {
  DynamodbToolboxIntegrationConstructProps,
  SUPPORTED_ATTRIBUTE_TYPES,
  TYPE_MAPPING,
} from "../types";
import {
  getAttributeAliases,
  getExpressionProperties,
  getPartitionKeyAlias,
} from "../utils";
import { FormatItem } from "./FormatItem";

type DynamodbToolboxQueryProps = {
  options: { attributes?: string[] };
} & DynamodbToolboxIntegrationConstructProps &
  CallAwsServiceProps;

export class DynamodbToolboxQuery extends CallAwsService {
  constructor(
    scope: Construct,
    id: string,
    { entity, tableArn, options, ...props }: DynamodbToolboxQueryProps
  ) {
    if (
      getAttributeAliases(entity).find(
        (alias) =>
          !SUPPORTED_ATTRIBUTE_TYPES.includes(
            entity.schema.attributes[alias].type
          )
      )
    ) {
      console.warn("Entity has unsupported types");
    }

    const { type } = entity.schema.attributes[getPartitionKeyAlias(entity)];
    const typeKey = `${TYPE_MAPPING[type]}.$`;

    const queryIamStatement = new PolicyStatement({
      actions: ["dynamodb:Query"],
      resources: [tableArn],
    });

    const { ProjectionExpression, ExpressionAttributeNames } =
      options.attributes === undefined
        ? {
            ProjectionExpression: undefined,
            ExpressionAttributeNames: undefined,
          }
        : getExpressionProperties(entity, options.attributes);

    const queryTask = new CallAwsService(scope, "Query", {
      service: "dynamodb",
      action: "query",
      iamResources: ["arn:aws:states:::aws-sdk:dynamodb:query"],
      additionalIamStatements: [queryIamStatement],
      parameters: {
        TableName: entity.table.name,
        KeyConditionExpression: "pk = :val",
        ExpressionAttributeValues: {
          ":val": {
            [typeKey]: "$.stateInput",
          },
        },
        ProjectionExpression,
        ExpressionAttributeNames,
      },
    });

    const map = new Map(scope, "MapItems", {
      itemsPath: JsonPath.stringAt("$.Items"),
      parameters: {
        "item.$": "$$.Map.Item.Value",
        "uuid.$": "States.UUID()",
      },
      resultPath: "$.Items",
    });
    map.iterator(
      new FormatItem(scope, "Format", {
        entity,
      })
    );

    const chain = queryTask.next(map);

    const logGroup = new LogGroup(scope, "QueryStateMachineLogGroup", {
      retention: RetentionDays.ONE_DAY,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const { stateMachineArn } = new StateMachine(scope, "QueryStateMachine", {
      definition: chain,
      stateMachineType: StateMachineType.EXPRESS,
      logs: {
        destination: logGroup,
        level: LogLevel.ALL,
        includeExecutionData: true,
      },
    });

    const startSyncExecutionIamStatement = new PolicyStatement({
      actions: ["states:StartSyncExecution"],
      resources: [stateMachineArn],
    });

    const { comment, inputPath, parameters, timeout, heartbeat, credentials } =
      props;

    super(scope, id, {
      service: "sfn",
      action: "startSyncExecution",
      iamResources: ["arn:aws:states:::aws-sdk:sfn:startSyncExecution"],
      additionalIamStatements: [startSyncExecutionIamStatement],
      comment,
      inputPath,
      parameters: {
        StateMachineArn: stateMachineArn,
        Input: {
          "stateInput.$": parameters ?? "$",
        },
      },
      resultSelector: {
        "Output.$": "States.StringToJson($.Output)",
      },
      // TODO: handle user input's resultPath
      outputPath: "$.Output",
      timeout,
      heartbeat,
      integrationPattern: IntegrationPattern.REQUEST_RESPONSE,
      credentials,
    });
  }
}

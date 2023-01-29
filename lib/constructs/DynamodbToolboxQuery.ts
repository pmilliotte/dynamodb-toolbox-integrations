import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { LogGroup } from "aws-cdk-lib/aws-logs";
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
import { getAttributeAliases, getPartitionKeyAlias } from "../utils/attributes";
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
      throw new Error("Entity has unsupported types");
    }

    const { type } = entity.schema.attributes[getPartitionKeyAlias(entity)];
    const typeKey = `${TYPE_MAPPING[type]}.$`;

    const queryIamStatement = new PolicyStatement({
      actions: ["dynamodb:Query"],
      resources: [tableArn],
    });

    const queryTask = new CallAwsService(scope, "QueryTask", {
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
      },
    });

    const map = new Map(scope, "MapItems", {
      itemsPath: JsonPath.stringAt("$.Items"),
      resultPath: "$.Items",
    });
    map.iterator(
      new FormatItem(scope, "Format", {
        entity,
        attributes: options.attributes,
      })
    );

    const chain = queryTask.next(map);

    const logGroup = new LogGroup(scope, "QueryStateMachineLogGroup");

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

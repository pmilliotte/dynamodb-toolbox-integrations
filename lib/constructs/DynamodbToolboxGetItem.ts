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
  DynamoGetItem,
} from "aws-cdk-lib/aws-stepfunctions-tasks";
import { Construct } from "constructs";
import {
  DynamodbToolboxIntegrationConstructProps,
  TYPE_MAPPING,
} from "../types";
import { getPartitionKeyAlias } from "../utils/attributes";
import { keysAliasToMap } from "../utils/keysAliasToMap";
import { validateEntityTypes } from "../utils/validation/validateEntityTypes";
import { FormatItem } from "./FormatItem";

type DynamodbToolboxGetItemProps = {
  options: { attributes?: string[] };
} & DynamodbToolboxIntegrationConstructProps &
  CallAwsServiceProps;

export class DynamodbToolboxGetItem extends CallAwsService {
  constructor(
    scope: Construct,
    id: string,
    { entity, options, ...props }: DynamodbToolboxGetItemProps
  ) {
    validateEntityTypes(entity);

    const { type } = entity.schema.attributes[getPartitionKeyAlias(entity)];
    const typeKey = `${TYPE_MAPPING[type]}.$`;

    const getItemTask = new DynamoGetItem(scope, "GetItemTask", {
      //@ts-expect-error
      table: entity.table.name,
      Key: keysAliasToMap(entity),
    });

    const map = new Map(scope, "MapItems", {
      //pas sure ?
      itemsPath: JsonPath.stringAt("$.Item"),
      resultPath: "$.Items",
    });
    map.iterator(
      new FormatItem(scope, "Format", {
        entity,
        attributes: options.attributes,
      })
    );

    const chain = getItemTask.next(map);

    const logGroup = new LogGroup(scope, "GetItemStateMachineLogGroup", {
      retention: RetentionDays.ONE_DAY,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const { stateMachineArn } = new StateMachine(scope, "GetItemStateMachine", {
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

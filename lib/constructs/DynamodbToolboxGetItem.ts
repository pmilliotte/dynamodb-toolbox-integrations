import { RemovalPolicy } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import {
  IntegrationPattern,
  LogLevel,
  Pass,
  StateMachine,
  StateMachineType,
} from "aws-cdk-lib/aws-stepfunctions";
import {
  CallAwsService,
  CallAwsServiceProps,
} from "aws-cdk-lib/aws-stepfunctions-tasks";
import { Construct } from "constructs";
import { keysAliasToMap } from "../utils/keysAliasToMap";
import { validateEntityTypes } from "../utils/validation/validateEntityTypes";
import { FormatItem } from "./FormatItem";
import Entity, {
  AttributeDefinitions,
  InferCompositePrimaryKey,
  InferItem,
  Overlay,
  ParseAttributes,
  ParsedAttributes,
  Writable,
} from "dynamodb-toolbox/dist/classes/Entity";
import { TableDef } from "dynamodb-toolbox/dist/classes/Table";
import { If, PreventKeys } from "dynamodb-toolbox/dist/lib/utils";
import type { A, O } from "ts-toolbelt";
import { Table } from "aws-cdk-lib/aws-dynamodb";

type DynamodbToolboxGetItemProps<
  EntityTable extends TableDef,
  EntityItemOverlay extends Overlay,
  EntityCompositeKeyOverlay extends Overlay,
  Name extends string,
  AutoExecute extends boolean,
  AutoParse extends boolean,
  Timestamps extends boolean,
  CreatedAlias extends string,
  ModifiedAlias extends string,
  TypeAlias extends string,
  ReadonlyAttributeDefinitions extends PreventKeys<
    AttributeDefinitions | Readonly<AttributeDefinitions>,
    CreatedAlias | ModifiedAlias | TypeAlias
  >,
  WritableAttributeDefinitions extends AttributeDefinitions,
  Attributes extends ParsedAttributes,
  $Item extends any,
  Item extends O.Object,
  CompositePrimaryKey extends O.Object
> = {
  options: { attributes?: string[] };
} & {
  entity: Entity<
    EntityItemOverlay,
    EntityCompositeKeyOverlay,
    EntityTable,
    Name,
    AutoExecute,
    AutoParse,
    Timestamps,
    CreatedAlias,
    ModifiedAlias,
    TypeAlias,
    ReadonlyAttributeDefinitions,
    WritableAttributeDefinitions,
    Attributes,
    $Item,
    Item,
    CompositePrimaryKey
  >;
  tableArn: string;
} & Pick<
    CallAwsServiceProps,
    | "comment"
    | "inputPath"
    | "parameters"
    | "timeout"
    | "heartbeat"
    | "credentials"
    | "resultSelector"
    | "outputPath"
    | "resultPath"
  >;

export class DynamodbToolboxGetItem<
  EntityTable extends TableDef,
  EntityItemOverlay extends Overlay = undefined,
  EntityCompositeKeyOverlay extends Overlay = EntityItemOverlay,
  Name extends string = string,
  AutoExecute extends boolean = true,
  AutoParse extends boolean = true,
  Timestamps extends boolean = true,
  CreatedAlias extends string = "created",
  ModifiedAlias extends string = "modified",
  TypeAlias extends string = "entity",
  ReadonlyAttributeDefinitions extends PreventKeys<
    AttributeDefinitions | Readonly<AttributeDefinitions>,
    CreatedAlias | ModifiedAlias | TypeAlias
  > = PreventKeys<
    AttributeDefinitions,
    CreatedAlias | ModifiedAlias | TypeAlias
  >,
  WritableAttributeDefinitions extends AttributeDefinitions = Writable<ReadonlyAttributeDefinitions>,
  Attributes extends ParsedAttributes = If<
    A.Equals<EntityItemOverlay, undefined>,
    ParseAttributes<
      WritableAttributeDefinitions,
      Timestamps,
      CreatedAlias,
      ModifiedAlias,
      TypeAlias
    >,
    ParsedAttributes<keyof EntityItemOverlay>
  >,
  $Item extends any = If<
    A.Equals<EntityItemOverlay, undefined>,
    InferItem<WritableAttributeDefinitions, Attributes>,
    EntityItemOverlay
  >,
  Item extends O.Object = A.Cast<$Item, O.Object>,
  CompositePrimaryKey extends O.Object = If<
    A.Equals<EntityItemOverlay, undefined>,
    InferCompositePrimaryKey<Item, Attributes>,
    O.Object
  >
> extends CallAwsService {
  constructor(
    scope: Construct,
    id: string,
    {
      entity,
      tableArn,
      options,
      ...props
    }: DynamodbToolboxGetItemProps<
      EntityTable,
      EntityItemOverlay,
      EntityCompositeKeyOverlay,
      Name,
      AutoExecute,
      AutoParse,
      Timestamps,
      CreatedAlias,
      ModifiedAlias,
      TypeAlias,
      ReadonlyAttributeDefinitions,
      WritableAttributeDefinitions,
      Attributes,
      $Item,
      Item,
      CompositePrimaryKey
    >
  ) {
    validateEntityTypes(entity);

    const getItemIamStatement = new PolicyStatement({
      actions: ["dynamodb:GetItem"],
      resources: [tableArn],
    });

    // TODO: handle attributes (cf query)
    const getItemTask = new CallAwsService(scope, "GetItem", {
      service: "dynamodb",
      action: "getItem",
      iamResources: ["arn:aws:states:::dynamodb:getItem"],
      additionalIamStatements: [getItemIamStatement],
      parameters: {
        TableName: entity.table.name,
        // TODO: use KeyConditionExpression for weird key names
        Key: keysAliasToMap(entity),
      },
      resultSelector: { "item.$": "$.Item", "uuid.$": "States.UUID()" },
    });

    const {
      comment,
      inputPath,
      parameters,
      timeout,
      heartbeat,
      credentials,
      outputPath,
      resultSelector,
      resultPath,
    } = props;

    const formatItem = new FormatItem(scope, "Format", {
      entity,
      options: { attributes: options.attributes },
    });

    formatItem.endStates[0].next(
      new Pass(scope, "OutputProcessing", {
        outputPath,
        parameters: resultSelector,
        resultPath,
      })
    );

    const chain = getItemTask.next(formatItem);

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

    super(scope, id, {
      service: "sfn",
      action: "startSyncExecution",
      iamResources: ["arn:aws:states:::aws-sdk:sfn:startSyncExecution"],
      additionalIamStatements: [startSyncExecutionIamStatement],
      comment,
      inputPath,
      parameters: {
        StateMachineArn: stateMachineArn,
        Input: parameters ?? { stateInput: "$" },
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

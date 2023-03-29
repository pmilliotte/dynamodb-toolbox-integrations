import { RemovalPolicy } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import {
  Choice,
  Condition,
  IntegrationPattern,
  JsonPath,
  LogLevel,
  Map,
  Pass,
  StateMachine,
  StateMachineType,
} from "aws-cdk-lib/aws-stepfunctions";
import {
  CallAwsService,
  CallAwsServiceProps,
} from "aws-cdk-lib/aws-stepfunctions-tasks";
import { Construct } from "constructs";
import { SUPPORTED_ATTRIBUTE_TYPES, TYPE_MAPPING } from "../types";
import {
  getAttributeAliases,
  getExpressionProperties,
  getPartitionKeyAlias,
  getPartitionKeyMap,
  getSortKeyMap,
} from "../utils";
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

type DynamodbToolboxQueryProps<
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
  options: {
    attributes?: string[];
    partitionPath?: string;
    startKeyPath?: string;
  };
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

export class DynamodbToolboxQuery<
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
    }: DynamodbToolboxQueryProps<
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

    const { attributes, startKeyPath, partitionPath } = options;

    const {
      ProjectionExpression,
      ExpressionAttributeNames,
      ExclusiveStartKey,
    } = getExpressionProperties(entity, attributes);

    const queryTask = new CallAwsService(scope, "Query", {
      service: "dynamodb",
      action: "query",
      iamResources: ["arn:aws:states:::aws-sdk:dynamodb:query"],
      additionalIamStatements: [queryIamStatement],
      parameters: {
        TableName: entity.table.name,
        KeyConditionExpression: "#0 = :val",
        ExpressionAttributeValues: {
          ":val": {
            [typeKey]: "$.stateInput",
          },
        },
        ProjectionExpression,
        ExpressionAttributeNames,
      },
    });

    const queryWithStartKeyTask = new CallAwsService(
      scope,
      "QueryWithStartKey",
      {
        service: "dynamodb",
        action: "query",
        iamResources: ["arn:aws:states:::aws-sdk:dynamodb:query"],
        additionalIamStatements: [queryIamStatement],
        parameters: {
          TableName: entity.table.name,
          KeyConditionExpression: "#0 = :val",
          ExpressionAttributeValues: {
            ":val": {
              [typeKey]: "$.stateInput",
            },
          },
          ProjectionExpression,
          ExpressionAttributeNames,
          ExclusiveStartKey,
        },
      }
    );

    const hasStartKey = new Choice(scope, "Has start key ?");

    const [partitionKey, sortKey] = [
      getPartitionKeyMap(entity),
      getSortKeyMap(entity),
    ];

    const {
      comment,
      inputPath,
      timeout,
      heartbeat,
      credentials,
      outputPath,
      resultSelector,
      resultPath,
    } = props;

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
        options: { attributes },
      })
    );

    const transformLastEvaluatedKey = new Pass(
      scope,
      "TransformLastEvaluatedKey",
      {
        inputPath: "$.LastEvaluatedKey",
        parameters: {
          [`${partitionKey}.$`]: `$.${partitionKey}.${
            TYPE_MAPPING[entity.schema.attributes[partitionKey].type]
          }`,
          [`${sortKey}.$`]: `$.${sortKey}.${
            TYPE_MAPPING[entity.schema.attributes[partitionKey].type]
          }`,
        },
      }
    );

    const mapOnItemsChain = map.next(
      new Pass(scope, "OutputProcessing", {
        outputPath,
        parameters: resultSelector,
        resultPath,
      })
    );

    const hasLastEvaluatedKey = new Choice(scope, "Has Last Evaluated Key ?");
    hasLastEvaluatedKey
      .when(
        Condition.isPresent("$.LastEvaluatedKey"),
        transformLastEvaluatedKey.next(mapOnItemsChain)
      )
      .otherwise(mapOnItemsChain);

    const definition = hasStartKey
      .when(
        Condition.and(
          Condition.isPresent(`$.startKey['${partitionKey}']`),
          Condition.isPresent(`$.startKey['${sortKey}']`)
        ),
        queryWithStartKeyTask.next(hasLastEvaluatedKey)
      )
      .otherwise(queryTask.next(hasLastEvaluatedKey));

    const logGroup = new LogGroup(scope, "QueryStateMachineLogGroup", {
      retention: RetentionDays.ONE_DAY,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const { stateMachineArn } = new StateMachine(scope, "QueryStateMachine", {
      definition,
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
        Input: {
          "stateInput.$": partitionPath ?? "$",
          ...(options.startKeyPath ? { "startKey.$": startKeyPath } : {}),
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

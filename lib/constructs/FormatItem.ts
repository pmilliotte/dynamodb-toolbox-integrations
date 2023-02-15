import {
  IChainable,
  INextable,
  JsonPath,
  Map,
  State,
} from "aws-cdk-lib/aws-stepfunctions";
import { Pass } from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import {
  valueToObject,
  separateFromPlaceholder,
  getAttributeAliases,
  getAttributeMaps,
  getAllTransformedDataAsArray,
  getPlaceholderValuesWithType,
  concatAliases,
  hydrate,
} from "../utils";
import Entity, {
  AttributeDefinitions,
  Overlay,
  ParsedAttributes,
} from "dynamodb-toolbox/dist/classes/Entity";
import { TableDef } from "dynamodb-toolbox/dist/classes/Table";
import { PreventKeys } from "dynamodb-toolbox/dist/lib/utils";
import type { O } from "ts-toolbelt";
import { intersection } from "lodash";

export interface FormatItemProps<
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
> {
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
  itemPath?: string;
  options: { attributes?: string[] };
}

export class FormatItem<
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
> implements IChainable
{
  readonly id: string;
  readonly startState: State;
  readonly endStates: INextable[];

  constructor(
    scope: Construct,
    id: string,
    {
      entity,
      itemPath = "$",
      options: { attributes },
    }: FormatItemProps<
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
    const allAliases = getAttributeAliases(entity);
    const allMaps = getAttributeMaps(entity);

    const aliases =
      attributes === undefined
        ? allAliases
        : intersection(allAliases, attributes);
    const maps =
      attributes === undefined
        ? allMaps
        : intersection(
            allMaps,
            attributes.map(
              (alias) => entity.schema.attributes[alias].map ?? alias
            )
          );

    const generatePlaceholderValuesTask = new Pass(
      scope,
      "GeneratePlaceholderValues",
      {
        parameters: {
          "item.$": "$.item",
          "uuid.$": "$.uuid",
          placeholderValues: getPlaceholderValuesWithType(maps, entity),
        },
      }
    );

    const mergeWithPlaceholderValuesTask = new Pass(
      scope,
      "MergeWithPlaceholderValues",
      {
        parameters: {
          "output.$": "States.JsonMerge($.placeholderValues, $.item, false)",
          "uuid.$": "$.uuid",
        },
      }
    );

    const hydrateTask = new Pass(scope, "Hydrate", {
      parameters: {
        output: hydrate(maps, entity, "$.output"),
        "uuid.$": "$.uuid",
      },
    });

    const aliasToObjectTask = new Pass(scope, "AliasToObject", {
      parameters: valueToObject(),
    });

    const separateFromPlaceholderTask = new Pass(
      scope,
      "SeparateFromPlaceholder",
      {
        parameters: separateFromPlaceholder(),
      }
    );

    const getAllTransformedDataAsArrayTask = new Pass(
      scope,
      "GetAllTransformedDataAsArray",
      {
        parameters: {
          "alias.$": "$.alias",
          "arrays.$": getAllTransformedDataAsArray(),
        },
      }
    );

    const getValuesToConcatTask = new Pass(scope, "GetValuesToConcat", {
      parameters: {
        "object.$": "$..arrays[?(@.length == 1)]",
      },
    });

    const getFirstItemTask = new Pass(scope, "GetFirstItem", {
      parameters: {
        "valueToConcat.$":
          "States.Format('{} {}', $.object[0].separator, $.object[0].valueToConcat)",
        "separator.$": "$.object[0].separator",
        "value.$": "$.object[0].valueToConcat",
      },
    });

    const concatTask = new Pass(scope, "Concat", {
      parameters: {
        "object.$": concatAliases(aliases),
      },
    });

    const toJsonTask = new Pass(scope, "ToJson", {
      parameters: {
        "object.$": "States.StringToJson($.object)",
      },
      outputPath: "$.object",
    });

    const mapOnMapsTask = new Map(scope, "MapOnMaps", {
      itemsPath: JsonPath.stringAt("$.output"),
      resultSelector: {
        "notNullValues.$": "$.[?(@.valueToConcat != ' ')].value",
        "allValues.$": "$.*.valueToConcat",
      },
    });
    mapOnMapsTask.iterator(
      aliasToObjectTask
        .next(separateFromPlaceholderTask)
        .next(getAllTransformedDataAsArrayTask)
        .next(getValuesToConcatTask)
        .next(getFirstItemTask)
    );

    generatePlaceholderValuesTask
      .next(mergeWithPlaceholderValuesTask)
      .next(hydrateTask)
      .next(mapOnMapsTask)
      .next(concatTask)
      .next(toJsonTask);

    this.startState = generatePlaceholderValuesTask;
    this.id = id;
    this.endStates = [toJsonTask];
  }
}

import {
  IChainable,
  INextable,
  JsonPath,
  Map,
  State,
} from "aws-cdk-lib/aws-stepfunctions";
import { Entity } from "../types";
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

export interface Props {
  entity: Entity;
  itemPath?: string;
}

export class FormatItem implements IChainable {
  readonly id: string;
  readonly startState: State;
  readonly endStates: INextable[];

  constructor(scope: Construct, id: string, { entity, itemPath = "$" }: Props) {
    const aliases = getAttributeAliases(entity);
    const maps = getAttributeMaps(entity);

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

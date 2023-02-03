import {
  IChainable,
  INextable,
  State,
} from "aws-cdk-lib/aws-stepfunctions";
import { Entity } from "../types";
import { Pass } from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import { mapToAlias } from "../utils/mapToAlias";
import { valueToObject } from "../utils/valueToObject";
import { separateFromPlaceholder } from "../utils/separateFromPlaceholder";
import { getAttributeAliases, getAttributeMaps } from "../utils/attributes";
import { getAllTransformedDataAsArray } from "../utils/getAllTransformedDataAsArray";
import { getFirstItem } from "../utils/getFirstItem";
import { getPlaceholderValuesWithType } from "../utils/getPlaceholderValuesWithType";
import { getValuesToConcat } from "../utils/getValuesToConcat";
import { concatAliases } from "../utils/concatAliases";
import { unmarshallMap } from "../utils/unmarshallMap";
import { valuesToOneValueArray } from "../utils/valuesToOneValueArray";
import { valuesToArray } from "../utils/valuesToArray";
import { mergeWithValueToConcat } from "../utils/mergeWithValueToConcat";

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

    const generatePlaceholder = new Pass(scope, "GeneratePlaceholder", {
      parameters: {
        "item.$": itemPath,
        "uuid.$": "States.UUID()",
      },
    });

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

    const unmarshallMapTask = new Pass(scope, "UnmarshallMap", {
      parameters: {
        output: unmarshallMap(entity, "$.output"),
        "uuid.$": "$.uuid",
      },
    });

    const mapToAliasTask = new Pass(scope, "MapToAlias", {
      parameters: { data: mapToAlias(entity, "$.output"), "uuid.$": "$.uuid" },
    });

    const aliasValuesToArrayTask = new Pass(scope, "AliasValuesToArray", {
      parameters: {
        data: valuesToOneValueArray(aliases, "$.data"),
        "uuid.$": "$.uuid",
      },
    });

    const aliasToObjectTask = new Pass(scope, "AliasToObject", {
      parameters: {
        data: valueToObject(aliases, "$.data"),
        "uuid.$": "$.uuid",
      },
    });

    const mergeWithValueToConcatTask = new Pass(
      scope,
      "MergeWithValueToConcat",
      {
        parameters: {
          data: mergeWithValueToConcat(aliases, "$.data"),
          "uuid.$": "$.uuid",
        },
      }
    );

    const aliasToArrayTask = new Pass(scope, "AliasToArray", {
      parameters: {
        "array.$": valuesToArray(aliases, "$.data"),
        "uuid.$": "$.uuid",
      },
    });

    const separateFromPlaceholderTask = new Pass(
      scope,
      "SeparateFromPlaceholder",
      {
        parameters: {
          "uuid.$": "$.uuid",
          arrays: separateFromPlaceholder(aliases, "$.array"),
        },
      }
    );

    const getAllTransformedDataAsArrayTask = new Pass(
      scope,
      "GetAllTransformedDataAsArray",
      {
        parameters: {
          "uuid.$": "$.uuid",
          "arrays.$": getAllTransformedDataAsArray(aliases, "$.arrays"),
          "notNullValue.$": "$.arrays.notNullValue[0]",
        },
      }
    );

    const getValuesToConcatTask = new Pass(scope, "GetValuesToConcat", {
      parameters: {
        "uuid.$": "$.uuid",
        object: getValuesToConcat(aliases, "$..arrays", "valueToConcat"),
        separator: getValuesToConcat(aliases, "$..arrays", "separator"),
        "notNullValue.$": "$.notNullValue",
      },
    });

    const getFirstItemTask = new Pass(scope, "GetFirstItem", {
      parameters: {
        object: getFirstItem(aliases, "$.object"),
        separator: getFirstItem(aliases, "$.separator"),
        "notNullValue.$": "$.notNullValue",
      },
    });

    const concatTask = new Pass(scope, "Concat", {
      parameters: {
        "object.$": concatAliases(entity, "$.object", "$.separator"),
      },
    });

    const toJsonTask = new Pass(scope, "ToJson", {
      parameters: {
        "object.$": "States.StringToJson($.object)",
      },
      outputPath: "$.object",
    });

    generatePlaceholder
      .next(generatePlaceholderValuesTask)
      .next(mergeWithPlaceholderValuesTask)
      .next(unmarshallMapTask)
      .next(mapToAliasTask)
      // Remove uuid values
      .next(aliasValuesToArrayTask)
      .next(aliasToObjectTask)
      .next(mergeWithValueToConcatTask)
      .next(aliasToArrayTask)
      .next(separateFromPlaceholderTask)
      .next(getAllTransformedDataAsArrayTask)
      .next(getValuesToConcatTask)
      .next(getFirstItemTask)
      .next(concatTask)
      .next(toJsonTask);

    this.startState = generatePlaceholder;
    this.id = id;
    this.endStates = [toJsonTask];
  }
}

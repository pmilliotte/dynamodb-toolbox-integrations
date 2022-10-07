import { Chain, CustomState, Map, Pass } from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import { keysAliasToMap } from "../utils/keysAliasToMap";
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
import { DynamodbToolboxIntegrationConstructProps } from "../types";

export class DynamodbToolboxGetItem extends Construct {
  public chain: Chain;

  constructor(
    scope: Construct,
    id: string,
    { entity }: DynamodbToolboxIntegrationConstructProps
  ) {
    super(scope, id);

    const aliases = getAttributeAliases(entity);
    const maps = getAttributeMaps(entity);

    const stateJson = {
      Type: "Task",
      Resource: "arn:aws:states:::dynamodb:getItem",
      Parameters: {
        TableName: entity.table.name,
        Key: keysAliasToMap(entity),
      },
      ResultSelector: {
        "item.$": "$.Item",
        "uuid.$": "States.UUID()",
      },
    };

    const getItemTask = new CustomState(this, "GetItemTask", { stateJson });

    const generatePlaceholderValuesTask = new Pass(
      this,
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
      this,
      "MergeWithPlaceholderValues",
      {
        parameters: {
          "output.$": "States.JsonMerge($.placeholderValues, $.item, false)",
          "uuid.$": "$.uuid",
        },
      }
    );

    const unmarshallMapTask = new Pass(this, "UnmarshallMap", {
      parameters: {
        output: unmarshallMap(entity, "$.output"),
        "uuid.$": "$.uuid",
      },
    });

    const mapToAliasTask = new Pass(this, "MapToAlias", {
      parameters: { data: mapToAlias(entity, "$.output"), "uuid.$": "$.uuid" },
    });

    const aliasValuesToArrayTask = new Pass(this, "AliasValuesToArray", {
      parameters: {
        data: valuesToOneValueArray(aliases, "$.data"),
        "uuid.$": "$.uuid",
      },
    });

    const aliasToObjectTask = new Pass(this, "AliasToObject", {
      parameters: {
        data: valueToObject(aliases, "$.data"),
        "uuid.$": "$.uuid",
      },
    });

    const mergeWithValueToConcatTask = new Pass(
      this,
      "MergeWithValueToConcat",
      {
        parameters: {
          data: mergeWithValueToConcat(aliases, "$.data"),
          "uuid.$": "$.uuid",
        },
      }
    );

    const aliasToArrayTask = new Pass(this, "AliasToArray", {
      parameters: {
        "array.$": valuesToArray(aliases, "$.data"),
        "uuid.$": "$.uuid",
      },
    });

    const separateFromPlaceholderTask = new Pass(
      this,
      "SeparateFromPlaceholder",
      {
        parameters: {
          "uuid.$": "$.uuid",
          arrays: separateFromPlaceholder(aliases, "$.array"),
        },
      }
    );

    const getAllTransformedDataAsArrayTask = new Pass(
      this,
      "GetAllTransformedDataAsArray",
      {
        parameters: {
          "uuid.$": "$.uuid",
          "arrays.$": getAllTransformedDataAsArray(aliases, "$.arrays"),
        },
      }
    );

    const getValuesToConcatTask = new Pass(this, "GetValuesToConcat", {
      parameters: {
        "uuid.$": "$.uuid",
        object: getValuesToConcat(aliases, "$..arrays", "valueToConcat"),
        separator: getValuesToConcat(aliases, "$..arrays", "separator"),
      },
    });

    const getFirstItemTask = new Pass(this, "GetFirstItem", {
      parameters: {
        object: getFirstItem(aliases, "$.object"),
        separator: getFirstItem(aliases, "$.separator"),
      },
    });

    const concatTask = new Pass(this, "Concat", {
      parameters: {
        "object.$": concatAliases(entity, "$.object", "$.separator"),
      },
    });

    const toJsonTask = new Pass(this, "ToJson", {
      parameters: {
        "object.$": "States.StringToJson($.object)",
      },
      outputPath: "$.object",
    });

    this.chain = getItemTask
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
  }
}

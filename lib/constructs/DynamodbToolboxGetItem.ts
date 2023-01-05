import { Chain, CustomState, Map, Pass } from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import { DynamodbToolboxIntegrationConstructProps } from "../utils";
import { keysAliasToMap } from "../utils/keysAliasToMap";
import { mapToAlias } from "../utils/mapToAlias";
import { aliasValuesToArray } from "../utils/aliasValuesToArray";
import { aliasToObject } from "../utils/aliasToObject";
import { aliasToArray } from "../utils/aliasToArray";
import { separateFromPlaceholder } from "../utils/separateFromPlaceholder";
import { getAttributeAliases, getAttributeMaps } from "../utils/attributes";
import { getAllTransformedDataAsArray } from "../utils/getAllTransformedDataAsArray";
import { getFirstItem } from "../utils/getFirstItem";
import { getPlaceholderValuesWithType } from "../utils/getPlaceholderValuesWithType";
import { getValuesToConcat } from "../utils/getValuesToConcat";
import { concat } from "../utils/concat";

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

    const mapToAliasTask = new Pass(this, "MapToAlias", {
      parameters: { data: mapToAlias(entity, "$.output"), "uuid.$": "$.uuid" },
    });

    const aliasValuesToArrayTask = new Pass(this, "AliasValuesToArray", {
      parameters: {
        "test.$": "States.JsonToString($.data)",
        data: aliasValuesToArray(entity, "$.data"),
        "uuid.$": "$.uuid",
      },
    });

    const aliasToObjectTask = new Pass(this, "AliasToObject", {
      parameters: { data: aliasToObject(entity, "$.data"), "uuid.$": "$.uuid" },
    });

    const aliasToArrayTask = new Pass(this, "AliasToArray", {
      parameters: {
        "array.$": aliasToArray(entity, "$.data"),
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
        "object.$": concat(entity, "$.object", "$.separator"),
      },
    });

    const toJsonTask = new Pass(this, "ToJson", {
      parameters: {
        "object.$": "States.StringToJson($.object)",
      },
      outputPath: "$.object",
    });

    const filterValuesTask = new Pass(this, "FilterValues", {
      parameters: {
        "filteredArray.$": `$..arrays[?(@.length == 1)]`,
      },
    });

    const keepRelevantValueTask = new Map(this, "KeepRelevantValue", {
      inputPath: "$.filteredArray",
    });
    keepRelevantValueTask.iterator(
      new Pass(this, "Iterator", {
        parameters: {
          "output.$": "States.Format('{}: {}', $.attributeName, $.value[0])",
        },
        outputPath: "$.output",
      })
    );

    // const keepRelevantValueTask = new Pass(this, "KeepRelevantValue", {
    //   parameters: {
    //     object: keepRelevantValue(aliases, "$..arrays"),
    //   },
    // });

    const formatString = new Pass(this, "FormatString", {
      parameters: {
        "test.$": `States.Format()`,
      },
    });

    // TO DO:
    // 1- Remove prefix and suffix from final output
    // 2- Remove null values
    this.chain = getItemTask
      .next(generatePlaceholderValuesTask)
      .next(mergeWithPlaceholderValuesTask)
      .next(mapToAliasTask)
      .next(aliasValuesToArrayTask)
      .next(aliasToObjectTask)
      .next(aliasToArrayTask)
      .next(separateFromPlaceholderTask)
      .next(getAllTransformedDataAsArrayTask)
      .next(getValuesToConcatTask)
      .next(getFirstItemTask)
      .next(concatTask)
      .next(toJsonTask);
    // .next(filterValuesTask)
    // .next(keepRelevantValueTask)
    // .next(formatString)
  }
}

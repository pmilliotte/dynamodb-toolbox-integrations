import { Chain, CustomState, Pass } from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import { aliasToMap } from "../utils/aliasToMap";
import { getAllTransformedDataAsArray } from "../utils/getAllTransformedDataAsArray";
import { getDefaultValues } from "../utils/getDefaultValues";
import { getFirstItem } from "../utils/getFirstItem";
import { getPlaceholderValues } from "../utils/getPlaceholderValues";
import { separateFromPlaceholder } from "../utils/separateFromPlaceholder";
import { getAttributeAliases, getAttributeMaps } from "../utils/attributes";
import { valueToObject } from "../utils/valueToObject";
import { getValuesToConcat } from "../utils/getValuesToConcat";
import { valuesToArray } from "../utils/valuesToArray";
import { valuesToOneValueArray } from "../utils/valuesToOneValueArray";
import { concatMaps } from "../utils/concatMaps";
import { mergeWithValueToConcat } from "../utils/mergeWithValueToConcat";
import { DynamodbToolboxIntegrationConstructProps } from "../types";

export class DynamodbToolboxPutItem extends Construct {
  public chain: Chain;

  constructor(
    scope: Construct,
    id: string,
    { entity }: DynamodbToolboxIntegrationConstructProps
  ) {
    super(scope, id);

    const aliases = getAttributeAliases(entity);
    const maps = getAttributeMaps(entity);

    const generateUuidTask = new Pass(this, "GetDefaultValues", {
      parameters: {
        // To be changed with inputPath
        "input.$": "$",
        "uuid.$": "States.UUID()",
        defaultValues: getDefaultValues(entity),
      },
    });

    const getNullInputValuesTask = new Pass(this, "CreatePlaceholderWithUuid", {
      parameters: {
        "input.$": "States.JsonMerge($.defaultValues, $.input, false)",
        "uuid.$": "$.uuid",
        placeholderValues: getPlaceholderValues(aliases),
      },
    });

    const mergeInputTask = new Pass(this, "MergeObjects", {
      parameters: {
        "uuid.$": "$.uuid",
        "data.$": "States.JsonMerge($.placeholderValues, $.input, false)",
      },
    });

    const aliasToMapTask = new Pass(this, "AliasToMap", {
      parameters: {
        "uuid.$": "$.uuid",
        data: aliasToMap(entity, "$.data"),
      },
    });

    const valuesToArrayTask = new Pass(this, "ValuesToArray", {
      parameters: {
        data: valuesToOneValueArray(maps, "$.data"),
        "uuid.$": "$.uuid",
      },
    });

    // Logic is here
    const mapsToObjectTask = new Pass(this, "MapsToObject", {
      parameters: {
        data: valueToObject(maps, "$.data", entity),
        "uuid.$": "$.uuid",
      },
    });

    const mergeWithValueToConcatTask = new Pass(
      this,
      "MergeWithValueToConcat",
      {
        parameters: {
          data: mergeWithValueToConcat(maps, "$.data"),
          "uuid.$": "$.uuid",
        },
      }
    );

    const aliasToArrayTask = new Pass(this, "MapsToArray", {
      parameters: {
        "array.$": valuesToArray(maps, "$.data"),
        "uuid.$": "$.uuid",
      },
    });

    const separateFromPlaceholderTask = new Pass(
      this,
      "SeparateFromPlaceholder",
      {
        parameters: {
          "uuid.$": "$.uuid",
          arrays: separateFromPlaceholder(maps, "$.array"),
        },
      }
    );

    const getAllTransformedDataAsArrayTask = new Pass(
      this,
      "GetAllTransformedDataAsArray",
      {
        parameters: {
          "uuid.$": "$.uuid",
          "arrays.$": getAllTransformedDataAsArray(maps, "$.arrays"),
        },
      }
    );

    const getValuesToConcatTask = new Pass(this, "GetValuesToConcat", {
      parameters: {
        "uuid.$": "$.uuid",
        object: getValuesToConcat(maps, "$..arrays", "valueToConcat"),
        separator: getValuesToConcat(maps, "$..arrays", "separator"),
      },
    });

    const getFirstItemTask = new Pass(this, "GetFirstItem", {
      parameters: {
        object: getFirstItem(maps, "$.object"),
        separator: getFirstItem(maps, "$.separator"),
      },
    });

    const concatTask = new Pass(this, "Concat", {
      parameters: {
        "object.$": concatMaps(entity, "$.object", "$.separator"),
      },
    });

    const toJsonTask = new Pass(this, "ToJson", {
      parameters: {
        "object.$": "States.StringToJson($.object)",
      },
      outputPath: "$.object",
    });

    const putItemTask = new CustomState(this, "PutItem", {
      stateJson: {
        Type: "Task",
        Resource: "arn:aws:states:::dynamodb:putItem",
        Parameters: {
          TableName: entity.table.name,
          "Item.$": "$",
        },
      },
    });

    this.chain = generateUuidTask
      .next(getNullInputValuesTask)
      .next(mergeInputTask)
      .next(aliasToMapTask)
      // remove uuid and marshall
      .next(valuesToArrayTask)
      .next(mapsToObjectTask)
      .next(mergeWithValueToConcatTask)
      .next(aliasToArrayTask)
      .next(separateFromPlaceholderTask)
      .next(getAllTransformedDataAsArrayTask)
      .next(getValuesToConcatTask)
      .next(getFirstItemTask)
      .next(concatTask)
      .next(toJsonTask)
      .next(putItemTask);
  }
}

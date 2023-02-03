import { Chain, CustomState, Pass } from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import { Entity } from "../types";
import { aliasToMap } from "../utils/aliasToMap";
import { getPlaceholderValues } from "../utils/getPlaceholderValues";
import { getAttributeAliases, getAttributeMaps } from "../utils/attributes";
import {
  valueToObjectUpdateItem,
  mergeWithValueToConcatUpdateItem,
  getAllTransformedDataAsArrayUpdateItem,
  separateFromPlaceholderUpdateItem,
} from "../utils/updateItem";
import { valuesToOneValueArray } from "../utils/valuesToOneValueArray";
import { valuesToArray } from "../utils/valuesToArray";
import { getValuesToConcat } from "../utils/getValuesToConcat";
import { getFirstItem } from "../utils/getFirstItem";
import { concatMapsUpdateItem } from "../utils/updateItem/concatMapsUpdateItem";
import { getDefaultValues } from "../utils/getDefaultValues";
import { concatMapsForKeyUpdateItem } from "../utils/updateItem/concatMapsForKeyUpdateItem";

export interface DynamodbToolboxUpdateItemProps {
  entity: Entity;
}

export class DynamodbToolboxUpdateItem extends Construct {
  public chain: Chain;

  constructor(
    scope: Construct,
    id: string,
    { entity }: DynamodbToolboxUpdateItemProps
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
        data: valueToObjectUpdateItem(maps, "$.data", entity),
        "uuid.$": "$.uuid",
      },
    });

    const mergeWithValueToConcatTask = new Pass(
      this,
      "MergeWithValueToConcat",
      {
        parameters: {
          data: mergeWithValueToConcatUpdateItem(maps, entity, "$.data"),
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
          arrays: separateFromPlaceholderUpdateItem(maps, "$.array"),
        },
      }
    );

    const getAllTransformedDataAsArrayTask = new Pass(
      this,
      "GetAllTransformedDataAsArray",
      {
        parameters: {
          "uuid.$": "$.uuid",
          "arrays.$": getAllTransformedDataAsArrayUpdateItem(maps, "$.arrays"),
        },
      }
    );

    const getValuesToConcatTask = new Pass(this, "GetValuesToConcat", {
      parameters: {
        "uuid.$": "$.uuid",
        UpdateExpression: getValuesToConcat(
          maps,
          "$..arrays",
          "valueToConcat",
          "UpdateExpression"
        ),
        ExpressionAttributeValue: getValuesToConcat(
          maps,
          "$..arrays",
          "valueToConcat",
          "ExpressionAttributeValue"
        ),
        ExpressionAttributeName: getValuesToConcat(
          maps,
          "$..arrays",
          "valueToConcat",
          "ExpressionAttributeName"
        ),
        separator: getValuesToConcat(maps, "$..arrays", "separator"),
      },
    });

    const getFirstItemTask = new Pass(this, "GetFirstItem", {
      parameters: {
        UpdateExpression: getFirstItem(maps, "$.UpdateExpression"),
        ExpressionAttributeValue: getFirstItem(
          maps,
          "$.ExpressionAttributeValue"
        ),
        ExpressionAttributeName: getFirstItem(
          maps,
          "$.ExpressionAttributeName"
        ),
        separator: getFirstItem(maps, "$.separator"),
      },
    });

    const concatTask = new Pass(this, "Concat", {
      parameters: {
        "Key.$": concatMapsForKeyUpdateItem(
          entity,
          "$.ExpressionAttributeValue"
        ),
        "UpdateExpression.$": concatMapsUpdateItem(
          entity,
          "$.UpdateExpression",
          "$.separator",
          "SET ",
          ""
        ),
        "ExpressionAttributeValues.$": concatMapsUpdateItem(
          entity,
          "$.ExpressionAttributeValue",
          "$.separator"
        ),
        "ExpressionAttributeNames.$": concatMapsUpdateItem(
          entity,
          "$.ExpressionAttributeName",
          "$.separator"
        ),
      },
    });

    const toJsonTask = new Pass(this, "ToJson", {
      parameters: {
        paramsUpdateItem: {
          "Key.$": "States.StringToJson($.Key)",
          "UpdateExpression.$": "$.UpdateExpression",
          "ExpressionAttributeValues.$":
            "States.StringToJson($.ExpressionAttributeValues)",
          "ExpressionAttributeNames.$":
            "States.StringToJson($.ExpressionAttributeNames)",
        },
      },
    });

    const udpateItemTask = new CustomState(this, "UpdateItemTask", {
      stateJson: {
        Type: "Task",
        Resource: "arn:aws:states:::dynamodb:updateItem",
        Parameters: {
          TableName: entity.table.name,
          "Key.$": "$.paramsUpdateItem.Key",
          "ExpressionAttributeValues.$":
            "$.paramsUpdateItem.ExpressionAttributeValues",
          "ExpressionAttributeNames.$":
            "$.paramsUpdateItem.ExpressionAttributeNames",
          "UpdateExpression.$": "$.paramsUpdateItem.UpdateExpression",
        },
        ResultPath: null,
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
      .next(udpateItemTask);
  }
}

import { Chain, CustomState, Pass } from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import { aliasToMap } from "../utils/aliasToMap";
import { applyAttributeProperties } from "../utils/applyAttributeProperties";
import { DynamodbToolboxIntegrationConstructProps } from "../utils/constructProps";
import { getAllTransformedDataAsArray } from "../utils/getAllTransformedDataAsArray";
import { mapToArray } from "../utils/mapToArray";
import { getDefaultValues } from "../utils/getDefaultValues";
import { getFirstItem } from "../utils/getFirstItem";
import { getPlaceholderValues } from "../utils/getPlaceholderValues";
import { keepRelevantValue } from "../utils/keepRelevantValue";
import { mapValuesToArray } from "../utils/mapValuesToArray";
import { separateFromPlaceholder } from "../utils/separateFromPlaceholder";
import { getAttributeAliases, getAttributeMaps } from "../utils/attributes";

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

    const mapToArrayTask = new Pass(this, "MapToArray", {
      parameters: {
        "uuid.$": "$.uuid",
        data: mapValuesToArray(entity, "$.data"),
      },
    });

    const applyAttributePropertiesTask = new Pass(
      this,
      "ApplyDynamodbToolboxEntityProperties",
      {
        parameters: {
          "uuid.$": "$.uuid",
          data: applyAttributeProperties(entity),
        },
      }
    );

    const getDataAsArrayTask = new Pass(this, "GetDataAsArray", {
      parameters: {
        "uuid.$": "$.uuid",
        "array.$": mapToArray(entity),
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

    const keepRelevantValueTask = new Pass(this, "KeepRelevantValue", {
      parameters: {
        object: keepRelevantValue(maps, "$..arrays"),
      },
    });

    const getFirstItemTask = new Pass(this, "GetFirstItem", {
      parameters: {
        object: getFirstItem(maps, "$.object"),
      },
    });

    const putItemTask = new CustomState(this, "PutItem", {
      stateJson: {
        Type: "Task",
        Resource: "arn:aws:states:::dynamodb:putItem",
        Parameters: {
          TableName: entity.table.name,
          "Item.$": "$.object",
        },
        ResultPath: null,
      },
    });

    this.chain = generateUuidTask
      .next(getNullInputValuesTask)
      .next(mergeInputTask)
      .next(aliasToMapTask)
      .next(mapToArrayTask)
      .next(applyAttributePropertiesTask)
      .next(getDataAsArrayTask)
      .next(separateFromPlaceholderTask)
      .next(getAllTransformedDataAsArrayTask)
      .next(keepRelevantValueTask)
      .next(getFirstItemTask)
      .next(putItemTask);
  }
}

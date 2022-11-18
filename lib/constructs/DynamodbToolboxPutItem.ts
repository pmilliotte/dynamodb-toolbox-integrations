import { Chain, CustomState, Pass } from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import { Entity } from "../types";
import { applyAttributeProperties } from "../utils/applyAttributeProperties";
import { getAllTransformedDataAsArray } from "../utils/getAllTransformedDataAsArray";
import { getDataAsArray } from "../utils/getDataAsArray";
import { getDefaultValues } from "../utils/getDefaultValues";
import { getFirstItem } from "../utils/getFirstItem";
import { getPlaceholderInputValues } from "../utils/getPlaceholderInputValues";
import { keepRelevantValue } from "../utils/keepRelevantValue";
import { mapToArray } from "../utils/mapToArray";
import { separateFromPlaceholder } from "../utils/separateFromPlaceholder";

export interface DynamodbToolboxPutItemProps {
  entity: Entity;
}

export class DynamodbToolboxPutItem extends Construct {
  public chain: Chain;

  constructor(
    scope: Construct,
    id: string,
    { entity }: DynamodbToolboxPutItemProps
  ) {
    super(scope, id);

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
        placeholderInputValues: getPlaceholderInputValues(entity),
      },
    });

    const mergeInputTask = new Pass(this, "MergeObjects", {
      parameters: {
        "uuid.$": "$.uuid",
        "data.$": "States.JsonMerge($.placeholderInputValues, $.input, false)",
      },
    });

    const mapToArrayTask = new Pass(this, "MapToArray", {
      parameters: {
        "uuid.$": "$.uuid",
        data: mapToArray(entity),
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
        "array.$": getDataAsArray(entity),
      },
    });

    const separateFromPlaceholderTask = new Pass(
      this,
      "SeparateFromPlaceholder",
      {
        parameters: {
          "uuid.$": "$.uuid",
          arrays: separateFromPlaceholder(entity),
        },
      }
    );

    const getAllTransformedDataAsArrayTask = new Pass(
      this,
      "GetAllTransformedDataAsArray",
      {
        parameters: {
          "uuid.$": "$.uuid",
          "arrays.$": getAllTransformedDataAsArray(entity),
        },
      }
    );

    const keepRelevantValueTask = new Pass(this, "KeepRelevantValue", {
      parameters: {
        object: keepRelevantValue(entity),
      },
    });

    const getFirstItemTask = new Pass(this, "GetFirstItem", {
      parameters: {
        object: getFirstItem(entity),
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

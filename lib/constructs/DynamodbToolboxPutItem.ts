import { Chain, CustomState, Pass } from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import { Entity } from "../types";
import { applyAttributeProperties } from "../utils/applyAttributeProperties";
import { DynamodbToolboxIntegrationConstructProps } from "../utils/constructProps";
import { getAllTransformedDataAsArray } from "../utils/getAllTransformedDataAsArray";
import { getDataAsArray } from "../utils/getDataAsArray";
import { getFirstItem } from "../utils/getFirstItem";
import { getPlaceholderInputValues } from "../utils/getPlaceholderInputValues";
import { keepRelevantValue } from "../utils/keepRelevantValue";
import { mapToArray } from "../utils/mapToArray";
import { separateFromPlaceholder } from "../utils/separateFromPlaceholder";

export class DynamodbToolboxPutItem extends Construct {
  public chain: Chain;

  constructor(
    scope: Construct,
    id: string,
    { entity }: DynamodbToolboxIntegrationConstructProps
  ) {
    super(scope, id);

    const generateUuid = new Pass(this, "GenerateUuidTask", {
      parameters: {
        // To be changed with inputPath
        "input.$": "$",
        "uuid.$": "States.UUID()",
      },
    });

    const getNullInputValuesTask = new Pass(this, "IntermediaryTask", {
      parameters: {
        "input.$": "$.input",
        "uuid.$": "$.uuid",
        placeholderInputValues: getPlaceholderInputValues(entity),
      },
    });

    const mergeInputTask = new Pass(this, "MergeInputTask", {
      parameters: {
        "uuid.$": "$.uuid",
        "data.$": "States.JsonMerge($.placeholderInputValues, $.input, false)",
      },
    });

    const mapToArrayTask = new Pass(this, "MapToArrayTask", {
      parameters: {
        "uuid.$": "$.uuid",
        data: mapToArray(entity),
      },
    });

    const applyAttributePropertiesTask = new Pass(
      this,
      "ApplyAttributePropertiesTask",
      {
        parameters: {
          "uuid.$": "$.uuid",
          data: applyAttributeProperties(entity),
        },
      }
    );

    const getDataAsArrayTask = new Pass(this, "GetDataAsArrayTask", {
      parameters: {
        "uuid.$": "$.uuid",
        "array.$": getDataAsArray(entity),
      },
    });

    const separateFromPlaceholderTask = new Pass(
      this,
      "SeparateFromPlaceholderTask",
      {
        parameters: {
          "uuid.$": "$.uuid",
          arrays: separateFromPlaceholder(entity),
        },
      }
    );

    const getAllTransformedDataAsArrayTask = new Pass(
      this,
      "GetAllTransformedDataAsArrayTask",
      {
        parameters: {
          "uuid.$": "$.uuid",
          "arrays.$": getAllTransformedDataAsArray(entity),
        },
      }
    );

    const keepRelevantValueTask = new Pass(this, "KeepRelevantValueTask", {
      parameters: {
        object: keepRelevantValue(entity),
      },
    });

    const getFirstItemTask = new Pass(this, "GetFirstItemTask", {
      parameters: {
        object: getFirstItem(entity),
      },
    });

    const putItemTask = new CustomState(this, "PutItemTask", {
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

    this.chain = generateUuid
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

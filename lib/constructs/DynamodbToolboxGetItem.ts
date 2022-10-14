import { Chain, CustomState, Pass } from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import { DynamodbToolboxIntegrationConstructProps } from "../utils";
import { applyKeyAttributeProperties } from "../utils/getItem/applyKeyAttributes";
import { applyKeyAttributePropertiesForUser } from "../utils/getItem/applyKeyAttributesForUser";

export class DynamodbToolboxGetItem extends Construct {
  public chain: Chain;

  constructor(
    scope: Construct,
    id: string,
    { entity }: DynamodbToolboxIntegrationConstructProps
  ) {
    super(scope, id);

    const transformKeyTask = new Pass(this, "TransformKey", {
      parameters: {
        input: applyKeyAttributeProperties(entity),
      },
    });

    const stateJson = {
      Type: "Task",
      Resource: "arn:aws:states:::dynamodb:getItem",
      Parameters: {
        TableName: entity.table.tableName,
        // "Item.$: "$.object", ??
        "Item.$": "$",
      },
      ResultPath: null,
    };
    const getItemTask = new CustomState(this, "GetItemTask", {
      stateJson,
    });

    const transformKeyForUserTask = new Pass(this, "TransformKeyForUser", {
      parameters: {
        input: applyKeyAttributePropertiesForUser(entity),
      },
    });

    this.chain = transformKeyTask
      .next(getItemTask)
      .next(transformKeyForUserTask);
  }
}

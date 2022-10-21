import { Chain, CustomState, Pass } from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import { DynamodbToolboxIntegrationConstructProps } from "../utils";
import { applyKeyAttributeProperties } from "../utils/getItem/applyKeyAttributes";
import { applyKeyAttributePropertiesForUser } from "../utils/getItem/applyKeyAttributesForUser";

export class DynamodbToolboxGetItem extends Construct {
  public task: CustomState;

  constructor(
    scope: Construct,
    id: string,
    { entity }: DynamodbToolboxIntegrationConstructProps
  ) {
    super(scope, id);

    const stateJson = {
      Type: "Task",
      Resource: "arn:aws:states:::dynamodb:getItem",
      Parameters: {
        TableName: entity.table.name,
        Key: applyKeyAttributeProperties(entity),
      },
      ResultSelector: {
        Item: applyKeyAttributePropertiesForUser(entity),
      },
      ResultPath: null,
    };
    const getItemTask = new CustomState(this, "GetItemTask", {
      stateJson,
    });

    this.task = getItemTask;
  }
}

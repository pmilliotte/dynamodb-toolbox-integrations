import { Chain, CustomState, Pass } from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import { Entity } from "../types";
import { applyAttributePropertiesUpdateItem } from "../utils/applyAttributePropertiesUpdateItem";

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

    const props = applyAttributePropertiesUpdateItem(entity);

    const applyAttributePropertiesTask = new Pass(
      this,
      "ApplyAttributePropertiesTask",
      {
        parameters: {
          propsSchema: props,
        },
      }
    );

    const udpateItemTask = new CustomState(this, "UpdateItemTask", {
      stateJson: {
        Type: "Task",
        Resource: "arn:aws:states:::dynamodb:updateItem",
        Parameters: {
          TableName: entity.table.name,
          "Key.$": "$.propsSchema.Key",
          "ExpressionAttributeValues.$":
            "$.propsSchema.ExpressionAttributeValues",
          "ExpressionAttributeNames.$":
            "$.propsSchema.ExpressionAttributeNames",
          "UpdateExpression.$": "$.propsSchema.UpdateExpression",
        },
        ResultPath: null,
      },
    });

    this.chain = applyAttributePropertiesTask.next(udpateItemTask);
  }
}

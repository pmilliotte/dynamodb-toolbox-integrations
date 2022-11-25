import { CustomState } from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import { DynamodbToolboxIntegrationConstructProps } from "../utils";
import { aliasToMap } from "../utils/aliasToMap";
import { mapToAlias } from "../utils/mapToAlias";

export class DynamodbToolboxGetItem extends CustomState {
  constructor(
    scope: Construct,
    id: string,
    { entity }: DynamodbToolboxIntegrationConstructProps
  ) {
    // const transformKeyTask = new Pass(this, "TransformKey", {
    //   parameters: {
    //     input: applyKeyAttributeProperties(entity),
    //   },
    // });

    const stateJson = {
      Type: "Task",
      Resource: "arn:aws:states:::dynamodb:getItem",
      Parameters: {
        TableName: entity.table.name,
        Key: aliasToMap(entity),
      },

      ResultPath: null,
      ResultSelector: {
        result: mapToAlias(entity),
      },
    };

    super(scope, id, {
      stateJson,
    });
    // We need to add a new Pass state to merge result from DB and null place holder

    // const transformKeyForUserTask = new Pass(this, "TransformKeyForUser", {
    //   parameters: {
    //     input: mapToAlias(entity),
    //   },
    // });
  }
}

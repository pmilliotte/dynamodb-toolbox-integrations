import { Chain, CustomState, Pass } from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import { DynamodbToolboxIntegrationConstructProps } from "../utils";
import { aliasToMap } from "../utils/aliasToMap";
import { getPlaceHolderNullValues } from "../utils/getPlaceHolderNullValues";
import { mapToAlias } from "../utils/mapToAlias";

export class DynamodbToolboxGetItem extends Construct {
  public chain: Chain;

  constructor(
    scope: Construct,
    id: string,
    { entity }: DynamodbToolboxIntegrationConstructProps
  ) {
    const stateJson = {
      Type: "Task",
      Resource: "arn:aws:states:::dynamodb:getItem",
      Parameters: {
        TableName: entity.table.name,
        Key: aliasToMap(entity),
      },

      ResultSelector: {
        "item.$": "$.Item",
        nullInputValues: getPlaceHolderNullValues(entity),
      },
    };

    super(scope, id);

    const getItemTask = new CustomState(this, "GetItemTask", { stateJson });

    const mergeInputWithNullValuesTask = new Pass(
      this,
      "mergeInputWithNullValues",
      {
        parameters: {
          "output.$": "States.JsonMerge($.nullInputValues, $.item, false)",
        },
      }
    );

    const mapToAliasTask = new Pass(this, "MapToAlias", {
      parameters: mapToAlias(entity),
    });

    // TO DO:
    // 1- Remove prefix and suffix from final output
    // 2- Remove null values
    this.chain = getItemTask
      .next(mergeInputWithNullValuesTask)
      .next(mapToAliasTask);
  }
}

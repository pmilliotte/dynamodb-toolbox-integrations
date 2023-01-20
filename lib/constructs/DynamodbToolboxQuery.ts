import { Chain, Pass } from "aws-cdk-lib/aws-stepfunctions";
import { CallAwsService } from "aws-cdk-lib/aws-stepfunctions-tasks";
import { Construct } from "constructs";
import { DynamodbToolboxIntegrationConstructProps } from "../types";
import { mapToAlias } from "../utils/mapToAlias";

export class DynamodbToolboxQuery extends Construct {
  public chain: Chain;

  constructor(
    scope: Construct,
    id: string,
    { entity }: DynamodbToolboxIntegrationConstructProps
  ) {
    const parameters = {
      TableName: entity.table.name,
      KeyConditionExpression: "pk = :val",
      ExpressionAttributeValues: {
        ":val": {
          S: "Query",
        },
      },
    };
    super(scope, id);

    const queryTask = new CallAwsService(this, "QueryTask", {
      service: "dynamodb",
      action: "query",
      iamResources: ["arn:aws:states:::aws-sdk:dynamodb:query"],
      parameters,
    });

    // We need to add a new Pass state to merge result from DB and null place holder
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

    //modifier tout ca

    this.chain = queryTask.next(new Pass(this, "hello"));
    // .next(mergeInputWithNullValuesTask)
    // .next(mapToAliasTask);
  }
}

import { Chain, Pass } from "aws-cdk-lib/aws-stepfunctions";
import { CallAwsService } from "aws-cdk-lib/aws-stepfunctions-tasks";
import { Construct } from "constructs";
import { DynamodbToolboxIntegrationConstructProps } from "../utils";
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
      KeyConditionExpression: "PK = :PK AND begins_with(SK, :SK)",
    };
    super(scope, id);

    const queryTask = new CallAwsService(this, "QueryTask", {
      service: "dynamodb",
      action: "query",
      iamResources: [entity.table.tableArn],
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

    this.chain = queryTask
      .next(mergeInputWithNullValuesTask)
      .next(mapToAliasTask);
  }
}

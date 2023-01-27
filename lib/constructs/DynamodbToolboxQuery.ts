import { Chain, JsonPath, Map, Pass } from "aws-cdk-lib/aws-stepfunctions";
import { CallAwsService } from "aws-cdk-lib/aws-stepfunctions-tasks";
import { Construct } from "constructs";
import {
  DynamodbToolboxIntegrationConstructProps,
  TYPE_MAPPING,
} from "../types";
import { getPartitionKeyAlias } from "../utils/attributes";
import { FormatItem } from "./FormatItem";

export class DynamodbToolboxQuery extends Construct {
  public chain: Chain;

  constructor(
    scope: Construct,
    id: string,
    {
      entity,
      options,
    }: DynamodbToolboxIntegrationConstructProps & {
      options: { attributes: string[] };
    }
  ) {
    const { type } = entity.schema.attributes[getPartitionKeyAlias(entity)];
    const typeKey = `${TYPE_MAPPING[type]}.$`;
    const parameters = {
      TableName: entity.table.name,
      KeyConditionExpression: "pk = :val",
      ExpressionAttributeValues: {
        ":val": {
          [typeKey]: "$",
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

    const map = new Map(this, "MapItems", {
      itemsPath: JsonPath.stringAt("$.Items"),
    });
    map.iterator(
      new FormatItem(this, "Format", { entity, attributes: options.attributes })
    );

    //modifier tout ca

    this.chain = queryTask.next(map);
    // .next(mergeInputWithNullValuesTask)
    // .next(mapToAliasTask);
  }
}

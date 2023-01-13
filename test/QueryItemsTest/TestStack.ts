import { App, RemovalPolicy, Stack } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { TestUtils } from "../Utils/TestUtils";
import { QueryStateMachine } from "./Construct";
import { TestQueryEntity } from "./dynamodb-toolbox";
import { TABLE_NAME } from "./types";

export class TestStack extends Stack {
  public putItemDynamodbToolboxFunctionName: string;
  public getItemDynamodbToolboxFunctionName: string;
  public queryStateMachineArn: string;

  constructor(scope: App, id: string) {
    super(scope, id);

    const { tableArn, tableName } = new Table(this, "QueryTable", {
      partitionKey: { name: "pk", type: AttributeType.STRING },
      sortKey: { name: "sk", type: AttributeType.STRING },
      tableName: TABLE_NAME,
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const {
      putItemDynamodbToolboxFunctionName,
      getItemDynamodbToolboxFunctionName,
    } = new TestUtils(this, "TestUtils", {
      tableArn,
      tableName,
      entityName: TestQueryEntity.name,
    });
    this.getItemDynamodbToolboxFunctionName =
      getItemDynamodbToolboxFunctionName;
    this.putItemDynamodbToolboxFunctionName =
      putItemDynamodbToolboxFunctionName;

    const { queryStateMachineArn } = new QueryStateMachine(
      this,
      "GetItemTestConstruct",
      { tableArn }
    );
    this.queryStateMachineArn = queryStateMachineArn;
  }
}

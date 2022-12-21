import { App, RemovalPolicy, Stack } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { PutItemStateMachine } from "./PutItemTest/Construct";
import { TestUtils } from "./TestUtils";

export class TestStack extends Stack {
  public getItemSdkFunctionName: string;
  public putItemDynamodbToolboxFunctionName: string;
  public putItemStateMachineArn: string;

  constructor(scope: App, id: string) {
    super(scope, id);

    const { tableArn, tableName } = new Table(this, "BigTable", {
      partitionKey: { name: "type", type: AttributeType.STRING },
      sortKey: { name: "name", type: AttributeType.STRING },
      tableName: "Test",
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const { getItemSdkFunctionName, putItemDynamodbToolboxFunctionName } =
      new TestUtils(this, "TestUtils", { tableArn, tableName });
    this.getItemSdkFunctionName = getItemSdkFunctionName;
    this.putItemDynamodbToolboxFunctionName =
      putItemDynamodbToolboxFunctionName;

    const { putItemStateMachineArn } = new PutItemStateMachine(
      this,
      "PutItemTestConstruct",
      { tableArn }
    );
    this.putItemStateMachineArn = putItemStateMachineArn;
  }
}

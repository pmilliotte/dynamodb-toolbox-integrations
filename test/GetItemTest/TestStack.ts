import { App, RemovalPolicy, Stack } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { TestUtils } from "../Utils/TestUtils";
import { GetItemStateMachine } from "./Construct";
import { TestGetEntity } from "./dynamodb-toolbox";
import { TABLE_NAME } from "./types";

export class TestStack extends Stack {
  public putItemDynamodbToolboxFunctionName: string;
  public getItemDynamodbToolboxFunctionName: string;
  public getItemStateMachineArn: string;

  constructor(scope: App, id: string) {
    super(scope, id);

    const { tableArn, tableName } = new Table(this, "GetTable", {
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
      entityName: TestGetEntity.name,
    });
    this.getItemDynamodbToolboxFunctionName =
      getItemDynamodbToolboxFunctionName;
    this.putItemDynamodbToolboxFunctionName =
      putItemDynamodbToolboxFunctionName;

    const { getItemStateMachineArn } = new GetItemStateMachine(
      this,
      "GetItemTestConstruct",
      { tableArn }
    );
    this.getItemStateMachineArn = getItemStateMachineArn;
  }
}

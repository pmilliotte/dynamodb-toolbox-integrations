import { App, RemovalPolicy, Stack } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { TestUtils } from "../Utils/TestUtils";
import { UpdateItemStateMachine } from "./Construct";
import { TestUpdateEntity } from "./dynamodb-toolbox";
import { TABLE_NAME } from "./types";

export class TestStack extends Stack {
  public getItemSdkFunctionName: string;
  public putItemDynamodbToolboxFunctionName: string;
  public updateItemDynamodbToolboxFunctionName: string;
  public updateItemStateMachineArn: string;

  constructor(scope: App, id: string) {
    super(scope, id);

    const { tableArn, tableName } = new Table(this, "UpdateTable", {
      partitionKey: { name: "pk", type: AttributeType.STRING },
      sortKey: { name: "sk", type: AttributeType.STRING },
      tableName: TABLE_NAME,
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const {
      getItemSdkFunctionName,
      putItemDynamodbToolboxFunctionName,
      updateItemDynamodbToolboxFunctionName,
    } = new TestUtils(this, "TestUtils", {
      tableArn,
      tableName,
      entityName: TestUpdateEntity.name,
    });
    this.getItemSdkFunctionName = getItemSdkFunctionName;
    this.putItemDynamodbToolboxFunctionName =
      putItemDynamodbToolboxFunctionName;
    this.updateItemDynamodbToolboxFunctionName =
      updateItemDynamodbToolboxFunctionName;

    const { updateItemStateMachineArn } = new UpdateItemStateMachine(
      this,
      "UpdateItemTestConstruct",
      { tableArn }
    );
    this.updateItemStateMachineArn = updateItemStateMachineArn;
  }
}

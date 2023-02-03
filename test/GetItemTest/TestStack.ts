import { App, RemovalPolicy, Stack } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { TestUtils } from "../Utils/TestUtils";
import { StateMachineWithGetItemTask } from "./Construct";
import { TestGetItemEntity } from "./dynamodb-toolbox";
import { TABLE_NAME } from "./types";

export class TestStack extends Stack {
  public putItemsDynamodbToolboxFunctionName: string;
  public getItemDynamodbToolboxFunctionName: string;
  public getItemStateMachineArn: string;

  constructor(
    scope: App,
    id: string,
    { attributes }: { attributes?: string[] }
  ) {
    super(scope, id);

    const { tableArn, tableName } = new Table(this, "GetItemTable", {
      partitionKey: { name: "pk", type: AttributeType.STRING },
      sortKey: { name: "sk", type: AttributeType.STRING },
      tableName: TABLE_NAME,
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const {
      putItemsDynamodbToolboxFunctionName,
      getItemDynamodbToolboxFunctionName,
    } = new TestUtils(this, "TestUtils", {
      tableArn,
      tableName,
      entityName: TestGetItemEntity.name,
    });
    this.getItemDynamodbToolboxFunctionName =
      getItemDynamodbToolboxFunctionName;

    this.putItemsDynamodbToolboxFunctionName =
      putItemsDynamodbToolboxFunctionName;

    const { getItemStateMachineArn } = new StateMachineWithGetItemTask(
      this,
      "GetItemTestConstruct",
      { tableArn, attributes }
    );
    this.getItemStateMachineArn = getItemStateMachineArn;
  }
}

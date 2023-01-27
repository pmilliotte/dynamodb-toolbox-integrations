import { App, RemovalPolicy, Stack } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { TestUtils } from "../Utils/TestUtils";
import { StateMachineWithQueryTask } from "./Construct";
import { TestQueryEntity } from "./dynamodb-toolbox";
import { TABLE_NAME } from "./types";

export class TestStack extends Stack {
  public putItemDynamodbToolboxFunctionName: string;
  public putItemsDynamodbToolboxFunctionName: string;

  public getItemDynamodbToolboxFunctionName: string;
  public queryDynamodbToolboxFunctionName: string;

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
      putItemsDynamodbToolboxFunctionName,

      getItemDynamodbToolboxFunctionName,

      queryDynamodbToolboxFunctionName,
    } = new TestUtils(this, "TestUtils", {
      tableArn,
      tableName,
      entityName: TestQueryEntity.name,
    });
    this.getItemDynamodbToolboxFunctionName =
      getItemDynamodbToolboxFunctionName;
    this.putItemDynamodbToolboxFunctionName =
      putItemDynamodbToolboxFunctionName;
    this.putItemsDynamodbToolboxFunctionName =
      putItemsDynamodbToolboxFunctionName;

    this.queryDynamodbToolboxFunctionName = queryDynamodbToolboxFunctionName;
    const { queryStateMachineArn } = new StateMachineWithQueryTask(
      this,
      "QueryTestConstruct",
      { tableArn }
    );
    this.queryStateMachineArn = queryStateMachineArn;
  }
}

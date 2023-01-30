import { App, RemovalPolicy, Stack } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { PutItemStateMachine } from "./Construct";
import { TestUtils } from "../Utils/TestUtils";
import { TABLE_NAME } from "./types";
import { TestPutEntity } from "./dynamodb-toolbox";

export class PutItemTestStack extends Stack {
  public getItemSdkFunctionName: string;
  public putItemDynamodbToolboxFunctionName: string;
  public putItemStateMachineArn: string;

  constructor(scope: App, id: string) {
    super(scope, id);

    const { tableArn, tableName } = new Table(this, "PutTable", {
      partitionKey: { name: "pk", type: AttributeType.STRING },
      sortKey: { name: "sk", type: AttributeType.STRING },
      tableName: TABLE_NAME,
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const { putItemStateMachineArn } = new PutItemStateMachine(
      this,
      "PutItemTestConstruct",
      { tableArn }
    );
    this.putItemStateMachineArn = putItemStateMachineArn;
  }
}

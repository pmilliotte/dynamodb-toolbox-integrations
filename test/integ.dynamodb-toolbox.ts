import { App, RemovalPolicy, Stack } from "aws-cdk-lib";
import { TestEntity } from "./dynamodb-toolbox/entity";
import {
  StateMachine,
  StateMachineType,
  Succeed,
} from "aws-cdk-lib/aws-stepfunctions";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { DynamodbToolboxPutItem } from "../lib";
import {
  ExpectedResult,
  IntegTest,
  InvocationType,
  LogType,
} from "@aws-cdk/integ-tests-alpha";
import { PutItemTest } from "./PutItem/TestConstruct";
import { UpdateItemTestConstruct } from "./UpdateItem/UpdateItemTestConstruct";

const app = new App();

class TestStack extends Stack {
  public putItemTestName: string;
  public updateItemTestLambdaName: string;
  constructor(scope: App, id: string) {
    super(scope, id);

    const { tableArn } = new Table(this, "BigTable", {
      partitionKey: { name: "pk", type: AttributeType.STRING },
      sortKey: { name: "sk", type: AttributeType.STRING },
      tableName: "Test",
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const { chain } = new DynamodbToolboxPutItem(this, `Put`, {
      // @ts-expect-error
      entity: TestEntity,
    });

    const stateMachine = new StateMachine(this, "StepFunction", {
      definition: chain.next(new Succeed(scope, "SuccessTask")),
      // Express needed for future get sync
      stateMachineType: StateMachineType.EXPRESS,
    });
    const { stateMachineArn } = stateMachine;

    stateMachine.addToRolePolicy(
      new PolicyStatement({
        actions: ["dynamodb:PutItem"],
        resources: [tableArn],
      })
    );

    const putItemTest = new PutItemTest(this, "PutItemTest", {
      tableArn,
      stateMachineArn,
    });
    this.putItemTestName = putItemTest.functionName;

    const { updateItemTestLambdaName } = new UpdateItemTestConstruct(
      this,
      "UpdateItemTest",
      { tableArn }
    );
    this.updateItemTestLambdaName = updateItemTestLambdaName;
  }
}

const testCase = new TestStack(app, "testStack");

const integ = new IntegTest(app, "testCase", {
  testCases: [testCase],
});

const putItemLambdaInvoke = integ.assertions.invokeFunction({
  functionName: testCase.putItemTestName,
  invocationType: InvocationType.REQUEST_RESPONE,
  logType: LogType.NONE,
});

putItemLambdaInvoke.expect(ExpectedResult.objectLike({ Payload: '""' }));

const updateItemLambdaInvoke = integ.assertions.invokeFunction({
  functionName: testCase.updateItemTestLambdaName,
  invocationType: InvocationType.REQUEST_RESPONE,
  logType: LogType.NONE,
});

updateItemLambdaInvoke.expect(ExpectedResult.objectLike({ Payload: '""' }));

app.synth();

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
import { DynamodbToolboxGetItem } from "../lib/constructs/DynamodbToolboxGetItem";
import { GetItemTest } from "./GetItem/TestConstruct";

const app = new App();

class TestStack extends Stack {
  public putItemTestName: string;

  constructor(scope: App, id: string) {
    super(scope, id);

    const { tableArn } = new Table(this, "BigTable", {
      partitionKey: { name: "type", type: AttributeType.STRING },
      sortKey: { name: "name", type: AttributeType.STRING },
      tableName: "Test",
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const { chain } = new DynamodbToolboxPutItem(this, `Put`, {
      // @ts-expect-error
      entity: TestEntity,
    });

    const putStateMachine = new StateMachine(this, "StepFunctionPut", {
      definition: chain.next(new Succeed(scope, "SuccessPut")),
      // Express needed for future get sync
      stateMachineType: StateMachineType.EXPRESS,
    });
    const { stateMachineArn: putStateMachineArn } = putStateMachine;

    putStateMachine.addToRolePolicy(
      new PolicyStatement({
        actions: ["dynamodb:PutItem"],
        resources: [tableArn],
      })
    );

    const putItemTest = new PutItemTest(this, "PutItemTest", {
      tableArn,
      stateMachineArn: putStateMachineArn,
    });
    this.putItemTestName = putItemTest.functionName;
  }
}

const testCase = new TestStack(app, "testStack");

const integ = new IntegTest(app, "testCase", {
  testCases: [testCase],
});

const putLambdaInvoke = integ.assertions.invokeFunction({
  functionName: testCase.putItemTestName,
  invocationType: InvocationType.REQUEST_RESPONE,
  logType: LogType.NONE,
});

putLambdaInvoke.expect(ExpectedResult.objectLike({ Payload: '""' }));

app.synth();

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
import { DynamodbToolboxQuery } from "../lib/constructs/DynamodbToolboxQuery";
import { QueryTest } from "./QueryItemsTest/Construct";

const app = new App();

class TestStack extends Stack {
  public queryTestName: string;

  constructor(scope: App, id: string) {
    super(scope, id);

    const { tableArn } = new Table(this, "BigTable", {
      partitionKey: { name: "type", type: AttributeType.STRING },
      sortKey: { name: "name", type: AttributeType.STRING },
      tableName: "Test",
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const { chain: queryCustomChain } = new DynamodbToolboxQuery(
      this,
      `Query`,
      {
        // @ts-expect-error
        entity: TestEntity,
      }
    );

    const getStateMachine = new StateMachine(this, "StepFunctionGet", {
      definition: queryCustomChain.next(new Succeed(scope, "SuccessGet")),
      // Express needed for future get sync
      stateMachineType: StateMachineType.EXPRESS,
    });
    const { stateMachineArn: getStateMachineArn } = getStateMachine;

    getStateMachine.addToRolePolicy(
      new PolicyStatement({
        actions: ["dynamodb:Query"],
        resources: [tableArn],
      })
    );

    const queryTest = new QueryTest(this, "QueryTest", {
      tableArn,
      stateMachineArn: getStateMachineArn,
    });
    this.queryTestName = queryTest.functionName;
  }
}

const testCase = new TestStack(app, "testStack");

const integ = new IntegTest(app, "testCase", {
  testCases: [testCase],
});

const getLambdaInvoke = integ.assertions.invokeFunction({
  functionName: testCase.queryTestName,
  invocationType: InvocationType.REQUEST_RESPONE,
  logType: LogType.TAIL,
});

getLambdaInvoke.expect(ExpectedResult.objectLike({ Payload: '""' }));

app.synth();

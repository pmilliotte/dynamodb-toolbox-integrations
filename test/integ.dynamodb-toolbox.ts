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
import { PutItemConstruct } from "./PutItem/PutItemConstruct";

const app = new App();

class TestStack extends Stack {
  public functionName: string;
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

    const stateMachine = new StateMachine(this, "StepFunction", {
      stateMachineName: "SaveAnimalStepFunction2",
      definition: chain.next(new Succeed(scope, "SuccessTask")),
      stateMachineType: StateMachineType.EXPRESS,
    });
    const { stateMachineArn } = stateMachine;

    stateMachine.addToRolePolicy(
      new PolicyStatement({
        actions: ["dynamodb:PutItem"],
        resources: [tableArn],
      })
    );

    const { functionName } = new PutItemConstruct(this, "PutItemConstruct", {
      tableArn,
      stateMachineArn,
    });
    this.functionName = functionName;
  }
}

const testCase = new TestStack(app, "testStack");

const integ = new IntegTest(app, "testCase", {
  testCases: [testCase],
});

const lambdaInvoke = integ.assertions.invokeFunction({
  functionName: testCase.functionName,
  invocationType: InvocationType.REQUEST_RESPONE,
  logType: LogType.NONE,
});

lambdaInvoke.expect(ExpectedResult.objectLike({ Payload: "false" }));

app.synth();

import { App, RemovalPolicy, Stack } from "aws-cdk-lib";
import { TestEntity } from "./dynamodb-toolbox/entity";
import {
  StateMachine,
  StateMachineType,
  Succeed,
} from "aws-cdk-lib/aws-stepfunctions";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import * as path from "path";
import { DynamodbToolboxPutItem } from "../lib";
import {
  ExpectedResult,
  IntegTest,
  InvocationType,
  LogType,
} from "@aws-cdk/integ-tests-alpha";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

const app = new App();

class TestStack extends Stack {
  public functionName: string;

  constructor(scope: App, id: string) {
    super(scope, id);

    const testTable = new Table(this, "BigTable", {
      partitionKey: { name: "type", type: AttributeType.STRING },
      sortKey: { name: "id", type: AttributeType.STRING },
      tableName: "Test",
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // // Put item lambda
    const lambdaPutItemRole = new Role(this, "DynamodbPut", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    });
    lambdaPutItemRole.addToPolicy(
      new PolicyStatement({
        actions: ["dynamodb:PutItem"],
        resources: [testTable.tableArn],
      })
    );

    const { functionName } = new NodejsFunction(this, "LambdaPutItem", {
      functionName: "Putitemlambda",
      handler: "main",
      entry: path.join(__dirname, `/functions/putItem.ts`),
      role: lambdaPutItemRole,
    });

    this.functionName = functionName;

    const { chain } = new DynamodbToolboxPutItem(this, `Put`, {
      // @ts-expect-error
      entity: TestEntity,
    });

    new StateMachine(this, "StepFunction", {
      stateMachineName: "SaveAnimalStepFunction2",
      definition: chain.next(new Succeed(scope, "SuccessTask")),
      stateMachineType: StateMachineType.EXPRESS,
    });
  }
}

const testCase = new TestStack(app, "testStack");

const integ = new IntegTest(app, "testCase", {
  testCases: [testCase],
});

const invoke = integ.assertions.invokeFunction({
  functionName: testCase.functionName,
  invocationType: InvocationType.REQUEST_RESPONE,
  logType: LogType.NONE,
  payload: JSON.stringify({ type: "Hello" }),
});

const stepFunctionInvoke = integ.assertions.awsApiCall(
  "StepFunctions",
  "startSyncExecution",
  {
    stateMachineArn: `arn:aws:states:${Stack.of(testCase).region}:${
      Stack.of(testCase).account
    }:stateMachine:SaveAnimalStepFunction2` /* required */,
    input: JSON.stringify({ type: "hello" }),
  }
);

invoke.expect(
  ExpectedResult.objectLike({
    Payload: "ok",
  })
);

app.synth();

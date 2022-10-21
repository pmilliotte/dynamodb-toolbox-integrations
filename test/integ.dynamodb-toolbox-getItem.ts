import { App, RemovalPolicy, Stack } from "aws-cdk-lib";
import { TestEntity } from "./dynamodb-toolbox/entity";
import {
  Chain,
  StateMachine,
  StateMachineType,
  Succeed,
} from "aws-cdk-lib/aws-stepfunctions";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import * as path from "path";
import { DynamodbToolboxGetItem } from "../lib";
import {
  ExpectedResult,
  IntegTest,
  InvocationType,
  LogType,
} from "@aws-cdk/integ-tests-alpha";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { stringList } from "aws-sdk/clients/datapipeline";

const app = new App();

class TestStack extends Stack {
  public getItemFunctionName: string;
  public putItemFunctionName: string;
  public stateMachine: StateMachine;

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

    const lambdaPutItem = new NodejsFunction(this, "LambdaPutItem", {
      functionName: "PutItemLambda",
      handler: "main",
      entry: path.join(__dirname, `/functions/putItem.ts`),
      role: lambdaPutItemRole,
    });

    this.putItemFunctionName = lambdaPutItem.functionName;

    // // Get item lambda
    const lambdaGetItemRole = new Role(this, "DynamodbGet", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    });
    lambdaGetItemRole.addToPolicy(
      new PolicyStatement({
        actions: ["dynamodb:GetItem"],
        resources: [testTable.tableArn],
      })
    );

    const lambdaGetItem = new NodejsFunction(this, "LambdaGetItem", {
      functionName: "GetItemLambda",
      handler: "main",
      entry: path.join(__dirname, `/functions/getItem.ts`),
      role: lambdaGetItemRole,
    });

    this.getItemFunctionName = lambdaGetItem.functionName;

    const { task: getItemTask } = new DynamodbToolboxGetItem(this, `Get`, {
      //@ts-expect-error
      entity: TestEntity,
    });

    console.log("getItemTask", getItemTask);
    const stateMachine = new StateMachine(this, "StepFunction", {
      stateMachineName: "SaveAnimalStepFunction2",
      definition: getItemTask.next(new Succeed(scope, "SuccessTask")),
      stateMachineType: StateMachineType.EXPRESS,
    });

    stateMachine.addToRolePolicy(
      new PolicyStatement({
        actions: ["dynamodb:PutItem"],
        resources: [testTable.tableArn],
      })
    );
  }
}

const testCase = new TestStack(app, "testStack");

const integ = new IntegTest(app, "testCase", {
  testCases: [testCase],
});

const invokeDynamoDbPut = integ.assertions.invokeFunction({
  functionName: testCase.putItemFunctionName,
  invocationType: InvocationType.REQUEST_RESPONE,
  logType: LogType.NONE,
  payload: JSON.stringify({ type: "Poupou" }),
});

// describe the results of the execution
const invokeDynamoDbGet = integ.assertions.invokeFunction({
  functionName: testCase.getItemFunctionName,
  invocationType: InvocationType.REQUEST_RESPONE,
  logType: LogType.NONE,
  payload: JSON.stringify({ type: "Poupou", id: "uniqueID-test" }),
});

// invokeDynamoDbPut.expect(
//   ExpectedResult.objectLike({ Payload: '"uniqueID-test"' })
// );

const stepFunctionInvoke = integ.assertions.awsApiCall(
  "StepFunctions",
  "startSyncExecution",
  {
    stateMachineArn: `arn:aws:states:${Stack.of(testCase).region}:${
      Stack.of(testCase).account
    }:stateMachine:SaveAnimalStepFunction2` /* required */,
    input: JSON.stringify({ type: "Poupou", id: "uniqueID-test" }),
  }
);

stepFunctionInvoke.expect(
  ExpectedResult.objectLike({
    StatusCode: 200,
    ExecutedVersion: "$LATEST",
    Payload: '"uniqueID-test"',
  })
);

invokeDynamoDbGet.expect(
  ExpectedResult.objectLike({
    StatusCode: 200,
    ExecutedVersion: "$LATEST",
    Payload: '"uniqueID-test"',
  })
);

app.synth();

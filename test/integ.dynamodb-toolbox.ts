import { App } from "aws-cdk-lib";
import { IntegTest } from "@aws-cdk/integ-tests-alpha";
import { TestStack } from "./TestStack";
import { testPutItem } from "./PutItemTest/testPutItem";

const app = new App();

const testCase = new TestStack(app, "testStack");

const integ = new IntegTest(app, "testCase", {
  testCases: [testCase],
});

testPutItem({ testCase, integ });

app.synth();

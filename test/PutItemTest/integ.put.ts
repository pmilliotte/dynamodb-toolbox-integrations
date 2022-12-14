import { App } from "aws-cdk-lib";
import { IntegTest } from "@aws-cdk/integ-tests-alpha";
import { TestStack } from "./TestStack";
import { testPutItem } from "./test";

const app = new App();

const testCase = new TestStack(app, "PutTestStack");

const integPut = new IntegTest(app, "PutTestCase", {
  testCases: [testCase],
});

testPutItem({ testCase, integ: integPut });

app.synth();

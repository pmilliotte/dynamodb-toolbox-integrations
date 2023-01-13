import { App } from "aws-cdk-lib";
import { IntegTest } from "@aws-cdk/integ-tests-alpha";
import { testGetItem } from "./test";
import { TestStack } from "./TestStack";

const app = new App();

const testCase = new TestStack(app, "GetTestStack");

const integGet = new IntegTest(app, "GetTestCase", {
  testCases: [testCase],
});

testGetItem({ testCase, integ: integGet });

app.synth();

import { App } from "aws-cdk-lib";
import { IntegTest } from "@aws-cdk/integ-tests-alpha";
import { testUpdateItem } from "./test";
import { TestStack } from "./TestStack";

const app = new App();

const testCase = new TestStack(app, "UpdateTestStack");

const integUpdate = new IntegTest(app, "UpdateTestCase", {
  testCases: [testCase],
});

testUpdateItem({ testCase, integ: integUpdate });

app.synth();

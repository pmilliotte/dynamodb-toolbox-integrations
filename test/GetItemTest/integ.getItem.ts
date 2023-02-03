import { App } from "aws-cdk-lib";
import { IntegTest } from "@aws-cdk/integ-tests-alpha";
import { TestStack } from "./TestStack";
import { testGetItem } from "./test";

const app = new App();

const testCase = new TestStack(app, "GetItemTestStack", {});

const integGetItem = new IntegTest(app, "GetItemTestCase", {
  testCases: [testCase],
});

testGetItem({ testCase, integ: integGetItem });

app.synth();

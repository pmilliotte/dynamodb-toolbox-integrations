import { App } from "aws-cdk-lib";
import { IntegTest } from "@aws-cdk/integ-tests-alpha";
import { TestStack } from "./TestStack";
import { testQueryItem } from "./test";


const app = new App();

const testCase = new TestStack(app, "QueryTestStack");

const integQuery = new IntegTest(app, "QueryTestCase", {
  testCases: [testCase],
});

testQueryItem({ testCase, integ: integQuery });

app.synth();

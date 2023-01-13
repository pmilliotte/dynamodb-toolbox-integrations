import { IntegTest } from "@aws-cdk/integ-tests-alpha";
import { TestStack } from "./TestStack";

export type AssertionTestInput = {
  testCase: TestStack;
  integ: IntegTest;
};

export const TABLE_NAME = "QueryTable";

import { IntegTest } from "@aws-cdk/integ-tests-alpha";
import { PutItemTestStack } from "./TestStack";

export type AssertionTestInput = {
  testCase: PutItemTestStack;
  integ: IntegTest;
};

export const TABLE_NAME = "PutTable";

import {
  ExpectedResult,
  InvocationType,
  Match,
} from "@aws-cdk/integ-tests-alpha";
import { AssertionTestInput } from "./types";

const PK = "Query";
const input1_PK1 = {
  pk: PK,
  sk: "popo",
};
const input2_PK1 = {
  pk: PK,
  sk: "papa",
};

const input1_PK2 = {
  pk: "algues",
  sk: "popo",
};
const input2_PK2 = {
  pk: PK,
  sk: "papa",
};

console.log(input2_PK1, input1_PK2, input2_PK2);
export const testQueryItem = ({ testCase, integ }: AssertionTestInput) => {
  const { withDynamodbToolbox, withDirectIntegration } = invokeResources({
    testCase,
    integ,
  });

  withDirectIntegration.expect(
    ExpectedResult.objectLike({
      status: "SUCCEEDED",
      output: Match.serializedJson({
        Count: 2,
        ScannedCount: 2,
        Items: [0, 1].map((item) => ({
          sk: {
            S: withDynamodbToolbox.getAttString(`Payload.Items.${item}.sk`),
          },
          pk: {
            S: withDynamodbToolbox.getAttString(`Payload.Items.${item}.pk`),
          },
          _ct: {
            S: withDynamodbToolbox.getAttString(
              `Payload.Items.${item}.created`
            ),
          },
          _md: {
            S: withDynamodbToolbox.getAttString(
              `Payload.Items.${item}.modified`
            ),
          },
          _et: {
            S: withDynamodbToolbox.getAttString(`Payload.Items.${item}.entity`),
          },
        })),
      }),
    })
  );
};

const invokeResources = ({ testCase, integ }: AssertionTestInput) => {
  const putItems = integ.assertions.invokeFunction({
    functionName: testCase.putItemsDynamodbToolboxFunctionName,
    invocationType: InvocationType.REQUEST_RESPONE,
    payload: JSON.stringify([input1_PK1, input2_PK1, input1_PK2, input2_PK2]),
  });

  const withDirectIntegration = putItems.next(
    //StartSyncExecution is not available for STANDARD workflows.
    integ.assertions.awsApiCall("StepFunctions", "startSyncExecution", {
      stateMachineArn: testCase.queryStateMachineArn,
      input: JSON.stringify({
        pk: PK,
      }),
    })
  );

  const withDynamodbToolbox = putItems.next(
    integ.assertions.invokeFunction({
      functionName: testCase.queryDynamodbToolboxFunctionName,
      invocationType: InvocationType.REQUEST_RESPONE,
      payload: JSON.stringify(PK),
    })
  );

  return { withDynamodbToolbox, withDirectIntegration };
};

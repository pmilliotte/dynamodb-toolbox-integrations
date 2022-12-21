import {
  ExpectedResult,
  InvocationType,
  Match,
} from "@aws-cdk/integ-tests-alpha";
import { AssertionTestInput } from "../types";

const WITH_DYNAMODB_TOOLBOX_NAME = "DYNAMODB_TOOOOOOOLBOX";
const WITH_DIRECT_INTEGRATION_NAME = "DIREEEEEEEECT_INTEGRATION";
const TYPE = "type";
const input = {
  type: TYPE,
  age: 3,
  count: 2,
  length: 1,
  sentencePrefixed: "sentencePrefixed",
  sentenceSuffixed: "sentenceSuffixed",
};

export const testPutItem = ({ testCase, integ }: AssertionTestInput) => {
  const { withDynamodbToolbox, withDirectIntegration } = invokeResources({
    testCase,
    integ,
  });

  withDirectIntegration.expect(
    ExpectedResult.objectLike({
      StatusCode: 200,
      Payload: Match.stringLikeRegexp(
        withDynamodbToolbox.getAttString("Payload.sentenceSuffixed.S")
      ),
    })
  );
};

const invokeResources = ({ testCase, integ }: AssertionTestInput) => {
  const withDynamodbToolbox = integ.assertions
    .invokeFunction({
      functionName: testCase.putItemDynamodbToolboxFunctionName,
      invocationType: InvocationType.REQUEST_RESPONE,
      payload: JSON.stringify({ name: WITH_DYNAMODB_TOOLBOX_NAME, ...input }),
    })
    .next(
      integ.assertions.invokeFunction({
        functionName: testCase.getItemSdkFunctionName,
        invocationType: InvocationType.REQUEST_RESPONE,
        payload: JSON.stringify({
          payload: { name: WITH_DYNAMODB_TOOLBOX_NAME, type: TYPE },
          stringResult: false,
        }),
      })
    );

  const withDirectIntegration = integ.assertions
    .awsApiCall("StepFunctions", "startSyncExecution", {
      stateMachineArn: testCase.putItemStateMachineArn,
      input: JSON.stringify({ name: WITH_DIRECT_INTEGRATION_NAME, ...input }),
    })
    .next(
      integ.assertions.invokeFunction({
        functionName: testCase.getItemSdkFunctionName,
        invocationType: InvocationType.REQUEST_RESPONE,
        payload: JSON.stringify({
          payload: {
            name: WITH_DIRECT_INTEGRATION_NAME,
            type: TYPE,
          },
          stringResult: false,
        }),
      })
    );

  return { withDynamodbToolbox, withDirectIntegration };
};

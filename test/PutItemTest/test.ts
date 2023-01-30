import {
  ExpectedResult,
  InvocationType,
  Match,
} from "@aws-cdk/integ-tests-alpha";
import { AssertionTestInput } from "./types";

const SK_WITH_DYNAMODB_TOOLBOX_NAME = "lambdaHandledPut";
const SK_WITH_DIRECT_INTEGRATION_NAME = "stepFunctionHandledPut";
const BOOLEAN_VALUE = false;
const PK = "Put";
const input = {
  pk: PK,
  age: 3,
  count: 2,
  length: 1,
  booleanInput: BOOLEAN_VALUE,
  sentencePrefixed: "sentencePrefixed",
  sentenceSuffixed: "sentenceSuffixed",
};

export const testPutItem = ({ testCase, integ }: AssertionTestInput) => {
  const { withDynamodbToolbox, withDirectIntegration } = invokeResources({
    testCase,
    integ,
  });

  const putHour = new Date().toISOString().slice(0, 13);

  withDirectIntegration.expect(
    ExpectedResult.objectLike({
      StatusCode: 200,
      Payload: Match.serializedJson({
        sk: {
          S: SK_WITH_DIRECT_INTEGRATION_NAME,
        },
        pk: {
          S: withDynamodbToolbox.getAttString("Payload.pk.S"),
        },
        sentenceSuffixed: {
          S: withDynamodbToolbox.getAttString("Payload.sentenceSuffixed.S"),
        },
        sentencePrefixed: {
          S: withDynamodbToolbox.getAttString("Payload.sentencePrefixed.S"),
        },
        age: {
          N: withDynamodbToolbox.getAttString("Payload.age.N"),
        },
        cnt: {
          N: withDynamodbToolbox.getAttString("Payload.cnt.N"),
        },
        lngth: {
          N: withDynamodbToolbox.getAttString("Payload.lngth.N"),
        },
        booleanInput: {
          BOOL: BOOLEAN_VALUE,
        },
        _ct: {
          S: Match.stringLikeRegexp(`${putHour}.{11}`),
        },
        _md: {
          S: Match.stringLikeRegexp(`${putHour}.{11}`),
        },
        _et: {
          S: withDynamodbToolbox.getAttString("Payload._et.S"),
        },
      }),
    })
  );
};

const invokeResources = ({ testCase, integ }: AssertionTestInput) => {
  const withDynamodbToolbox = integ.assertions
    .invokeFunction({
      functionName: testCase.putItemDynamodbToolboxFunctionName,
      invocationType: InvocationType.REQUEST_RESPONE,
      payload: JSON.stringify({ sk: SK_WITH_DYNAMODB_TOOLBOX_NAME, ...input }),
    })
    .next(
      integ.assertions.invokeFunction({
        functionName: testCase.getItemSdkFunctionName,
        invocationType: InvocationType.REQUEST_RESPONE,
        payload: JSON.stringify({
          sk: { S: SK_WITH_DYNAMODB_TOOLBOX_NAME },
          pk: { S: PK },
        }),
      })
    );

  const withDirectIntegration = integ.assertions
    .awsApiCall("StepFunctions", "startSyncExecution", {
      stateMachineArn: testCase.putItemStateMachineArn,
      input: JSON.stringify({ sk: SK_WITH_DIRECT_INTEGRATION_NAME, ...input }),
    })
    .next(
      integ.assertions.invokeFunction({
        functionName: testCase.getItemSdkFunctionName,
        invocationType: InvocationType.REQUEST_RESPONE,
        payload: JSON.stringify({
          sk: { S: SK_WITH_DIRECT_INTEGRATION_NAME },
          pk: { S: PK },
        }),
      })
    );

  return { withDynamodbToolbox, withDirectIntegration };
};

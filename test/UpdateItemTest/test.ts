import {
  ExpectedResult,
  InvocationType,
  Match,
} from "@aws-cdk/integ-tests-alpha";
import { AssertionTestInput } from "./types";

const SK_WITH_DYNAMODB_TOOLBOX_NAME = "lambdaHandledUpdate";
const SK_WITH_DIRECT_INTEGRATION_NAME = "stepFunctionHandledUpdate";
const PK = "Update";
const input = {
  pk: PK,
  age: 3,
  count: 2,
  length: 1,
  sentencePrefixed: "sentencePrefixed",
  sentenceSuffixed: "sentenceSuffixed",
};

export const testUpdateItem = ({ testCase, integ }: AssertionTestInput) => {
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
      payload: JSON.stringify({
        sk: SK_WITH_DYNAMODB_TOOLBOX_NAME,
        ...input,
      }),
    })
    .next(
      integ.assertions.invokeFunction({
        functionName: testCase.updateItemDynamodbToolboxFunctionName,
        invocationType: InvocationType.REQUEST_RESPONE,
        payload: JSON.stringify({
          sk: SK_WITH_DYNAMODB_TOOLBOX_NAME,
          ...input,
          age: 4,
        }),
      })
    )
    .next(
      integ.assertions.invokeFunction({
        functionName: testCase.getItemSdkFunctionName,
        invocationType: InvocationType.REQUEST_RESPONE,
        payload: JSON.stringify({
          pk: { S: PK },
          sk: { S: SK_WITH_DYNAMODB_TOOLBOX_NAME },
        }),
      })
    );

  const withDirectIntegration = integ.assertions
    .invokeFunction({
      functionName: testCase.putItemDynamodbToolboxFunctionName,
      invocationType: InvocationType.REQUEST_RESPONE,
      payload: JSON.stringify({
        sk: SK_WITH_DIRECT_INTEGRATION_NAME,
        ...input,
      }),
    })
    .next(
      integ.assertions.awsApiCall("StepFunctions", "startSyncExecution", {
        stateMachineArn: testCase.updateItemStateMachineArn,
        input: JSON.stringify({
          sk: SK_WITH_DIRECT_INTEGRATION_NAME,
          ...input,
          age: 4,
        }),
      })
    )
    .next(
      integ.assertions.invokeFunction({
        functionName: testCase.getItemSdkFunctionName,
        invocationType: InvocationType.REQUEST_RESPONE,
        payload: JSON.stringify({
          pk: { S: PK },
          sk: { S: SK_WITH_DIRECT_INTEGRATION_NAME },
        }),
      })
    );

  return { withDynamodbToolbox, withDirectIntegration };
};

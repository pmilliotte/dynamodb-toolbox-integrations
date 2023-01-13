import {
  ExpectedResult,
  InvocationType,
  // Match,
} from "@aws-cdk/integ-tests-alpha";
import { AssertionTestInput } from "./types";

const SK_WITH_DYNAMODB_TOOLBOX_NAME = "lambdaHandledGet";
const PK = "Get";
const input = {
  pk: PK,
};

export const testQueryItem = ({ testCase, integ }: AssertionTestInput) => {
  const { withDynamodbToolbox } = invokeResources({
    testCase,
    integ,
  });

  const putHour = new Date().toISOString().slice(0, 13);

  // withDirectIntegration.expect(
  //   ExpectedResult.objectLike({
  //     status: "SUCCEEDED",
  //     output: Match.serializedJson({
  //       sk: SK_WITH_DYNAMODB_TOOLBOX_NAME,
  //       pk: withDynamodbToolbox.getAttString("Payload.pk"),
  //       // sentenceSuffixed: withDynamodbToolbox.getAttString(
  //       //   "Payload.sentenceSuffixed"
  //       // ),
  //       // sentencePrefixed: withDynamodbToolbox.getAttString(
  //       //   "Payload.sentencePrefixed"
  //       // ),
  //       age: withDynamodbToolbox.getAttString("Payload.age"),
  //       count: withDynamodbToolbox.getAttString("Payload.count"),
  //       length: withDynamodbToolbox.getAttString("Payload.length"),
  //       created: Match.stringLikeRegexp(`${putHour}.{11}`),
  //       modified: Match.stringLikeRegexp(`${putHour}.{11}`),
  //       entity: withDynamodbToolbox.getAttString("Payload.entity"),
  //     }),
  //   })
  // );

  withDynamodbToolbox.expect(
    ExpectedResult.objectLike({
      StatusCode: "200",
    })
    //   })
  );
};

const invokeResources = ({ testCase, integ }: AssertionTestInput) => {
  const putItem = integ.assertions.invokeFunction({
    functionName: testCase.putItemDynamodbToolboxFunctionName,
    invocationType: InvocationType.REQUEST_RESPONE,
    payload: JSON.stringify({
      sk: SK_WITH_DYNAMODB_TOOLBOX_NAME,
      ...input,
    }),
  });

  // const withDirectIntegration = putItem.next(
  //   integ.assertions.awsApiCall("StepFunctions", "startSyncExecution", {
  //     stateMachineArn: testCase.queryStateMachineArn,
  //     input: JSON.stringify({
  //       sk: SK_WITH_DYNAMODB_TOOLBOX_NAME,
  //       pk: PK,
  //     }),
  //   })
  // );

  const withDynamodbToolbox = putItem.next(
    integ.assertions.invokeFunction({
      functionName: testCase.getItemDynamodbToolboxFunctionName,
      invocationType: InvocationType.REQUEST_RESPONE,
      payload: JSON.stringify({
        sk: SK_WITH_DYNAMODB_TOOLBOX_NAME,
        pk: PK,
      }),
    })
  );

  return { withDynamodbToolbox };
};

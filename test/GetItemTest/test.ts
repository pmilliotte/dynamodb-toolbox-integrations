import {
  ExpectedResult,
  InvocationType,
  Match,
} from "@aws-cdk/integ-tests-alpha";
import { getAttributeAliases } from "../../lib/utils/attributes";
import { TestGetItemEntity } from "./dynamodb-toolbox";
import { AssertionTestInput } from "./types";

const inputs = [
  {
    pk: "cactus",
    sk: "H",
    age: 3,
    count: 1,
    length: 25,
  },
  {
    pk: "cactus",
    sk: "L",
    age: 1,
    count: 2,
    length: 15,
  },
  {
    pk: "palmier",
    sk: "L",
    age: 10,
    count: 0,
    length: 100,
  },
  {
    pk: "bonsai",
    sk: "L",
    age: 5,
    count: 1,
    length: 30,
  },
];

export const testGetItem = ({ testCase, integ }: AssertionTestInput) => {
  const { withDynamodbToolbox, withDirectIntegration } = invokeResources({
    testCase,
    integ,
  });

  const aliases = getAttributeAliases(
    // @ts-expect-error
    TestGetItemEntity
  );

  // const putHour = new Date().toISOString().slice(0, 13);

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

  withDirectIntegration.expect(
    ExpectedResult.objectLike({
      status: "SUCCEEDED",
      output: Match.serializedJson({
        Count: 2,
        ScannedCount: 2,
        Item: [0, 1].map((item) =>
          aliases.reduce(
            (acc, alias) => ({
              ...acc,
              ...([
                // TODO: create utils to identify dynamodb-toolbox generated properties
                ...Object.keys(inputs[0]),
                "sk",
                "created",
                "modified",
                "entity",
              ].includes(alias)
                ? {
                    [alias]: withDynamodbToolbox.getAttString(
                      `Payload.Item.${item}.${alias}`
                    ),
                  }
                : {}),
            }),
            {}
          )
        ),
      }),
    })
  );
};

const invokeResources = ({ testCase, integ }: AssertionTestInput) => {
  const putItems = integ.assertions.invokeFunction({
    functionName: testCase.putItemsDynamodbToolboxFunctionName,
    invocationType: InvocationType.REQUEST_RESPONE,
    payload: JSON.stringify(inputs),
  });

  const withDirectIntegration = putItems.next(
    integ.assertions.awsApiCall("StepFunctions", "startSyncExecution", {
      stateMachineArn: testCase.getItemStateMachineArn,
      input: JSON.stringify({ pk: "palmier", sk: "L" }),
    })
  );

  const withDynamodbToolbox = putItems.next(
    integ.assertions.invokeFunction({
      functionName: testCase.getItemDynamodbToolboxFunctionName,
      invocationType: InvocationType.REQUEST_RESPONE,
      payload: JSON.stringify({ pk: "palmier", sk: "L" }),
    })
  );

  return { withDynamodbToolbox, withDirectIntegration };
};

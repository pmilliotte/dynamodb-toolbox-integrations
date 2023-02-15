import {
  ExpectedResult,
  InvocationType,
  Match,
} from "@aws-cdk/integ-tests-alpha";
import { getAttributeAliases } from "../../lib/utils/attributes";
import { TestQueryEntity } from "./dynamodb-toolbox";
import { AssertionTestInput } from "./types";

const PK_TO_NOT_QUERY = "ToNotQuery";
const PK_TO_QUERY = "ToQuery";
const input = {
  pk: PK_TO_QUERY,
  age: 3,
  count: 2,
  length: 1,
};
const inputs = [
  {
    sk: "sk1",
    ...input,
  },
  {
    sk: "sk2",
    ...input,
  },
  {
    ...input,
    pk: PK_TO_NOT_QUERY,
    sk: "sk3",
  },
];

export const testQueryItem = ({ testCase, integ }: AssertionTestInput) => {
  const { withDynamodbToolbox, withDirectIntegration } = invokeResources({
    testCase,
    integ,
  });

  const aliases = getAttributeAliases(TestQueryEntity);

  withDirectIntegration.expect(
    ExpectedResult.objectLike({
      status: "SUCCEEDED",
      output: Match.serializedJson({
        Count: 2,
        ScannedCount: 2,
        Items: [0, 1].map((item) =>
          aliases.reduce(
            (acc, alias) => ({
              ...acc,
              ...([
                // TODO: create utils to identify dynamodb-toolbox generated properties
                ...Object.keys(input),
                "sk",
                "created",
                "modified",
                "entity",
              ].includes(alias)
                ? {
                    [alias]: withDynamodbToolbox.getAttString(
                      `Payload.Items.${item}.${alias}`
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
      stateMachineArn: testCase.queryStateMachineArn,
      input: JSON.stringify(PK_TO_QUERY),
    })
  );

  const withDynamodbToolbox = putItems.next(
    integ.assertions.invokeFunction({
      functionName: testCase.queryDynamodbToolboxFunctionName,
      invocationType: InvocationType.REQUEST_RESPONE,
      payload: JSON.stringify(PK_TO_QUERY),
    })
  );

  return { withDynamodbToolbox, withDirectIntegration };
};

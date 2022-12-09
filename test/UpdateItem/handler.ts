import { SFNClient, StartSyncExecutionCommand } from "@aws-sdk/client-sfn";
import has from "lodash/has";
import { input, updateItemEntityTest } from "./testUtils";

const sfnClient = new SFNClient({ region: "eu-west-1" });

const baseData = {
  pk: "updateItemEntityTest",
  prefixField: "aaa",
  suffixField: "aaa",
  prefixAndSuffixField: "aaa",
  onlyRequiredStringField: "aaa",
  onlyRequiredNumberField: 123,
};

export const main = async (): Promise<string> => {
  await updateItemEntityTest.put({
    sk: "lambdaHandled",
    ...baseData,
  });

  await updateItemEntityTest.put({
    sk: "stepFunctionHandled",
    ...baseData,
  });

  await updateItemEntityTest.update({
    ...input,
    sk: "lambdaHandled",
  });

  const { Item: item1 } = await updateItemEntityTest.get({
    pk: "updateItemEntityTest",
    sk: "lambdaHandled",
  });

  const sfnCommand = new StartSyncExecutionCommand({
    input: JSON.stringify({
      sk: "stepFunctionHandled",
      ...input,
    }),
    stateMachineArn: process.env.stateMachineArn,
  });

  await sfnClient.send(sfnCommand);

  const { Item: item2 } = await updateItemEntityTest.get({
    pk: "updateItemEntityTest",
    sk: "stepFunctionHandled",
  });

  if (item1 === undefined || item2 === undefined) {
    return "Item should not be undefined";
  }

  let keysString = `It should have key(s)`;

  Object.keys(item1).forEach((key) => {
    const hasKey = has(item2, key);

    if (!hasKey) {
      keysString = keysString + " " + key;
    }
  });

  if (keysString !== `It should have key(s)`) {
    return keysString;
  }

  return "";
};

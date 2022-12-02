import { SFNClient, StartSyncExecutionCommand } from "@aws-sdk/client-sfn";
import has from "lodash/has";
import { input, updateItemEntityTest } from "./testUtils";

const sfnClient = new SFNClient({ region: "eu-west-1" });

const baseData = {
  type: "updateItemEntityTest",
  prefixField: "aaa",
  suffixField: "aaa",
  prefixAndSuffixField: "aaa",
  onlyRequiredStringField: "aaa",
  onlyRequiredNumberField: 123,
};

export const main = async (): Promise<string> => {
  await updateItemEntityTest.put({
    name: "lambdaHandled",
    ...baseData,
  });

  await updateItemEntityTest.put({
    name: "stepFunctionHandled",
    ...baseData,
  });

  await updateItemEntityTest.update({
    ...input,
    name: "lambdaHandled",
  });

  const { Item: item1 } = await updateItemEntityTest.get({
    type: "updateItemEntityTest",
    name: "lambdaHandled",
  });

  const sfnCommand = new StartSyncExecutionCommand({
    input: JSON.stringify({
      name: "stepFunctionHandled",
      ...input,
    }),
    stateMachineArn: process.env.stateMachineArn,
  });

  await sfnClient.send(sfnCommand);

  const { Item: item2 } = await updateItemEntityTest.get({
    type: "updateItemEntityTest",
    name: "stepFunctionHandled",
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

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
  console.log("base data", {
    sk: "lambdaHandled",
    ...baseData,
  });
  await updateItemEntityTest.put({
    sk: "lambdaHandled",
    ...baseData,
  });

  console.log("base data", {
    sk: "lambdaHandled",
    ...baseData,
  });

  await updateItemEntityTest.put({
    sk: "stepFunctionHandled",
    ...baseData,
  });

  console.log("update data", {
    ...input,
    sk: "lambdaHandled",
  });

  await updateItemEntityTest.update({
    ...input,
    sk: "lambdaHandled",
  });
  console.log("updated item with ddbt");

  const { Item: item1 } = await updateItemEntityTest.get({
    pk: "updateItemEntityTest",
    sk: "lambdaHandled",
  });
  console.log("get", {
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
  console.log("sfn command");

  await sfnClient.send(sfnCommand);
  console.log("update item start");

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

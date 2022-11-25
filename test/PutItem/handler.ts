import { TestEntity } from "../dynamodb-toolbox";
import { SFNClient, StartSyncExecutionCommand } from "@aws-sdk/client-sfn";
import has from "lodash/has";

const sfnClient = new SFNClient({ region: "eu-west-1" });

const input = {
  type: "type",
  age: 3,
  count: 2,
  length: 1,
  sentencePrefixed: "sentencePrefixed",
  sentenceSuffixed: "sentenceSuffixed",
};

export const main = async (): Promise<string> => {
  await TestEntity.put({
    name: "name1",
    ...input,
  });

  const { Item: item1 } = await TestEntity.get({
    type: "type",
    name: "name1",
  });

  const sfnCommand = new StartSyncExecutionCommand({
    input: JSON.stringify({
      name: "name2",
      ...input,
    }),
    stateMachineArn: process.env.stateMachineArn,
  });

  await sfnClient.send(sfnCommand);

  const { Item: item2 } = await TestEntity.get({
    type: "type",
    name: "name2",
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

  // keysString = `It should not have key(s)`;

  // Object.keys(item2).forEach((key) => {
  //   const hasKey = has(item1, key);

  //   if (!hasKey) {
  //     keysString = keysString + " " + key;
  //   }
  // });

  // if (keysString !== `It should not have key(s)`) {
  //   return keysString;
  // }

  return "";
};

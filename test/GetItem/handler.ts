import { TestEntity } from "../dynamodb-toolbox";
import { SFNClient, StartSyncExecutionCommand } from "@aws-sdk/client-sfn";
import has from "lodash/has";
import { isEqual } from "lodash";

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
    name: "name",
    ...input,
  });

  // Fetched with dynamoodb toolbox
  const { Item: item1 } = await TestEntity.get({
    type: "type",
    name: "name",
  });

  const getItemSfnCommand = new StartSyncExecutionCommand({
    input: JSON.stringify({
      name: "name",
      type: "type",
    }),
    stateMachineArn: process.env.stateMachineArn,
  });

  const sfnResult = await sfnClient.send(getItemSfnCommand);

  // if (!isEqual(item1, sfnResult.output)) {
  //   return "Item should not be undefined";
  // }

  console.log(sfnResult);

  return "";
};

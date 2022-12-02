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

export const main = async (): Promise<unknown> => {
  console.log("88888888888888888");
  console.log(input);

  // Put with dynamoodb toolbox
  await TestEntity.put({
    name: "testname",
    ...input,
  });

  // Fetched with dynamoodb toolbox
  const { Item: item1 } = await TestEntity.get({
    type: "type",
    name: "testname",
  });

  const getItemSfnCommand = new StartSyncExecutionCommand({
    input: JSON.stringify({
      name: "testname",
      type: "type",
    }),
    stateMachineArn: process.env.stateMachineArn,
  });

  const sfnResult = await sfnClient.send(getItemSfnCommand);

  console.log(item1);

  console.log(sfnResult.output);

  if (!isEqual(item1, sfnResult.output)) {
    // return Object.keys(sfnResult);
    return "I";
  }

  return "";
};

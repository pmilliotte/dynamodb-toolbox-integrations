import { TestEntity } from "../dynamodb-toolbox";
import { SFNClient, StartSyncExecutionCommand } from "@aws-sdk/client-sfn";
import has from "lodash/has";

const sfnClient = new SFNClient({ region: "eu-west-1" });

export const main = async (): Promise<boolean> => {
  const responsePut = await TestEntity.put({
    type: "type1",
    name: "name1",
  });

  const { Item: item1 } = await TestEntity.get({
    type: "type1",
    name: "name1",
  });

  const sfnCommand = new StartSyncExecutionCommand({
    input: JSON.stringify({
      type: "type1",
      name: "name2",
    }),
    stateMachineArn: process.env.stateMachineArn,
  });

  await sfnClient.send(sfnCommand);

  const { Item: item2 } = await TestEntity.get({
    type: "type1",
    name: "name2",
  });

  if (item1 === undefined || item2 === undefined) {
    return false;
  }

  return (
    item1.type === item2.type &&
    Object.keys(item1).every((key) => {
      console.log(key, has(item2, key));
      return has(item2, key);
    })
  );
};

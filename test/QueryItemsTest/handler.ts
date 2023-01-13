import { TestEntity } from "../dynamodb-toolbox";
import { SFNClient, StartSyncExecutionCommand } from "@aws-sdk/client-sfn";
import { isEqual } from "lodash";

const sfnClient = new SFNClient({ region: "eu-west-1" });

const inputArbre = {
  type: "arbre",
  name: "Jean-Claude",
  age: 3,
  count: 2,
};

const inputAlgues = {
  type: "algues",
  name: "Algumus",
  age: 3,
  count: 2,
};

export const main = async (): Promise<unknown> => {
  // Put with dynamoodb toolbox
  await TestEntity.put({
    ...inputArbre,
  });

  await TestEntity.put({
    ...inputArbre,
    name: "Jean-David",
  });
  await TestEntity.put({
    ...inputArbre,
    name: "Jean-Marc",
  });

  await TestEntity.put({
    ...inputAlgues,
  });

  await TestEntity.put({
    ...inputAlgues,
    name: "Mumus",
  });

  await TestEntity.put({
    ...inputAlgues,
    name: "Tutus",
  });

  // Fetched with dynamoodb toolbox
  const { Items: ItemsArbre } = await TestEntity.query({
    type: "arbre",
  });

  const querySfnCommand = new StartSyncExecutionCommand({
    input: JSON.stringify({
      type: "arbre",
    }),
    stateMachineArn: process.env.stateMachineArn,
  });

  const sfnResult = await sfnClient.send(querySfnCommand);

  console.log("Items fetched with ddtb:", ItemsArbre);

  console.log("SFNResult Ouput", sfnResult.output);

  // console.log("SFNResult keys", Object.keys(sfnResult));

  if (!isEqual(ItemsArbre, sfnResult.output)) {
    return "I";
  }

  return "";
};

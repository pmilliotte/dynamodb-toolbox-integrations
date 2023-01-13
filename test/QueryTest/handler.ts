import { SFNClient, StartSyncExecutionCommand } from "@aws-sdk/client-sfn";
import { isEqual } from "lodash";
import { TestQueryEntity } from "./dynamodb-toolbox";

const sfnClient = new SFNClient({ region: "eu-west-1" });

const inputArbre = {
  pk: "arbre",
  sk: "Jean-Claude",
};

const inputAlgues = {
  pk: "algues",
  sk: "Algumus",
};

export const main = async (): Promise<unknown> => {
  // Put with dynamoodb toolbox
  await TestQueryEntity.put({
    ...inputArbre,
  });

  await TestQueryEntity.put({
    ...inputArbre,
    sk: "Jean-David",
  });
  await TestQueryEntity.put({
    ...inputArbre,
    sk: "Jean-Marc",
  });

  await TestQueryEntity.put({
    ...inputAlgues,
  });

  await TestQueryEntity.put({
    ...inputAlgues,
    sk: "Mumus",
  });

  await TestQueryEntity.put({
    ...inputAlgues,
    sk: "Tutus",
  });

  // Fetched with dynamoodb toolbox
  const { Items: ItemsArbre } = await TestQueryEntity.query({
    pk: "arbre",
  });

  const querySfnCommand = new StartSyncExecutionCommand({
    input: JSON.stringify({
      pk: "arbre",
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

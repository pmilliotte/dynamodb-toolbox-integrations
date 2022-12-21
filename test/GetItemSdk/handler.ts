import {
  AttributeValue,
  DynamoDBClient,
  GetItemCommand,
} from "@aws-sdk/client-dynamodb";
const dynamodbClient = new DynamoDBClient({});

export const main = async ({
  payload: { type, name },
  stringResult,
}: {
  payload: {
    type: string;
    name: string;
  };
  stringResult: boolean;
}): Promise<string | Record<string, AttributeValue> | undefined> => {
  const getItemCommand = new GetItemCommand({
    Key: { name: { S: name }, type: { S: type } },
    TableName: process.env.tableName,
  });

  const { Item } = await dynamodbClient.send(getItemCommand);

  return stringResult ? JSON.stringify(Item) : Item;
};

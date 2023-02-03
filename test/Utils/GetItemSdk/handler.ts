import {
  AttributeValue,
  DynamoDBClient,
  GetItemCommand,
} from "@aws-sdk/client-dynamodb";
const dynamodbClient = new DynamoDBClient({});

export const main = async (
  payload: Record<string, AttributeValue>
): Promise<string | Record<string, AttributeValue> | undefined> => {
  const getItemCommand = new GetItemCommand({
    Key: payload,
    TableName: process.env.tableName,
  });

  const { Item } = await dynamodbClient.send(getItemCommand);

  return Item;
};

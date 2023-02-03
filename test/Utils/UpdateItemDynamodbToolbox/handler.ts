import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Entity, Table } from "dynamodb-toolbox";
const documentClient = new DocumentClient({ region: "eu-west-1" });
export const main = async (payload: Record<string, unknown>): Promise<void> => {
  const TestUpdateTable = new Table({
    name: process.env.tableName as string,
    partitionKey: "pk",
    sortKey: "sk",
    DocumentClient: documentClient,
    // removeNullAttributes: false,
  });
  const TestUpdateEntity = new Entity({
    name: "Update",
    attributes: {
      pk: {
        partitionKey: true,
        type: "string",
      },
      sk: { sortKey: true, type: "string" },
      requiredNumber: { type: "number" },
      requiredString: { type: "string" },
      optionalString: { type: "string" },
    },
    table: TestUpdateTable,
  });
  // @ts-expect-error
  await TestUpdateEntity.update(payload);
};

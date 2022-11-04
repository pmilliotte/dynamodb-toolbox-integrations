import { Entity, Table } from "dynamodb-toolbox";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const documentClient = new DocumentClient({ region: "eu-west-1" });

const TestTable = new Table({
  name: "Test",
  partitionKey: "type",
  sortKey: "id",
  DocumentClient: documentClient,
});

export const TestEntity = new Entity({
  name: "Test",
  attributes: {
    type: {
      partitionKey: true,
      type: "string",
    },
    id: { sortKey: true, type: "string" },
  },
  table: TestTable,
} as const);

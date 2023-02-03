import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Table } from "dynamodb-toolbox";
import { TABLE_NAME } from "../types";

const documentClient = new DocumentClient({ region: "eu-west-1" });

export const TestGetItemTable = new Table({
  name: TABLE_NAME,
  partitionKey: "pk",
  sortKey: "sk",
  DocumentClient: documentClient,
  // removeNullAttributes: false,
});

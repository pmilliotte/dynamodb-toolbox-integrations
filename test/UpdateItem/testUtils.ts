import { Entity } from "dynamodb-toolbox";

import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Table } from "dynamodb-toolbox";

const documentClient = new DocumentClient({ region: "eu-west-1" });

const TestTable = new Table({
  name: "Test",
  partitionKey: "pk",
  sortKey: "sk",
  DocumentClient: documentClient,
});

export const updateItemEntityTest = new Entity({
  name: "Test",
  attributes: {
    pk: {
      partitionKey: true,
      type: "string",
    },
    sk: { sortKey: true, type: "string" },
    prefixField: { type: "string", required: true, prefix: "PREFIX" },
    suffixField: { type: "string", required: true, suffix: "SUFFIX" },
    prefixAndSuffixField: {
      type: "string",
      required: true,
      prefix: "PREFIX",
      suffix: "SUFFIX",
    },
    onlyRequiredStringField: { type: "string", required: true },
    onlyRequiredNumberField: { type: "number", required: true },
  },
  table: TestTable,
});

export const input = {
  pk: "updateItemEntityTest",
  prefixField: "ghi",
  suffixField: "jkl",
  prefixAndSuffixField: "mno",
  onlyRequiredStringField: "pqr",
  onlyRequiredNumberField: 123,
};

export const output = {
  pk: "updateItemEntityTest",
  prefixField: "ghi",
  suffixField: "jkl",
  prefixAndSuffixField: "mno",
  onlyRequiredStringField: "pqr",
  onlyRequiredNumberField: 123,
};

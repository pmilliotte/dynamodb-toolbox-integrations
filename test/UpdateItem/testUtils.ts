import { Entity } from "dynamodb-toolbox";
import { TestTable } from "../dynamodb-toolbox/table";

export const updateItemEntityTest = new Entity({
  name: "Test",
  attributes: {
    type: {
      partitionKey: true,
      type: "string",
      prefix: "PK",
    },
    id: { sortKey: true, type: "string", suffix: "SK" },
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
  type: "updateItemEntityTest",
  prefixField: "ghi",
  suffixField: "jkl",
  prefixAndSuffixField: "mno",
  onlyRequiredStringField: "pqr",
  onlyRequiredNumberField: 123,
};

export const output = {
  type: "updateItemEntityTest",
  prefixField: "ghi",
  suffixField: "jkl",
  prefixAndSuffixField: "mno",
  onlyRequiredStringField: "pqr",
  onlyRequiredNumberField: 123,
};

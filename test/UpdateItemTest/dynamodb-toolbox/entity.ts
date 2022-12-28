import { Entity } from "dynamodb-toolbox";
import { TestUpdateTable } from "./table";

export const TestUpdateEntity = new Entity({
  name: "Update",
  attributes: {
    pk: {
      partitionKey: true,
      type: "string",
    },
    sk: { sortKey: true, type: "string" },
    age: { type: "number" },
    count: { type: "number", map: "cnt" },
    lngth: { type: "number", alias: "length" },
    sentencePrefixed: { type: "string", prefix: "prefix" },
    sentenceSuffixed: { type: "string", prefix: "suffix" },
    nullInput: { type: "string" },
    nullInputSetToNull: { type: "string" },
  },
  table: TestUpdateTable,
});

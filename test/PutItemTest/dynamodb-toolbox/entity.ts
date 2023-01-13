import { Entity } from "dynamodb-toolbox";
import { TestPutTable } from "./table";

export const TestPutEntity = new Entity({
  name: "Put",
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
    sentenceSuffixed: { type: "string", suffix: "suffix" },
    nullInput: { type: "string" },
    nullInputSetToNull: { type: "string" },
    booleanInput: { type: "boolean" },
  },
  table: TestPutTable,
});

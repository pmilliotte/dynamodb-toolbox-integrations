import { Entity } from "dynamodb-toolbox";
import { TestGetItemTable } from "./table";

export const TestGetItemEntity = new Entity({
  name: "GetItem",
  attributes: {
    pk: {
      partitionKey: true,
      type: "string",
    },
    sk: { sortKey: true, type: "string" },
    age: { type: "number" },
    count: { type: "number", map: "cnt" },
    lngth: { type: "number", alias: "length" },
    nullInput: { type: "string" },
    nullInputSetToNull: { type: "string" },
  },
  table: TestGetItemTable,
});

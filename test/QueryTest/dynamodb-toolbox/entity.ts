import { Entity } from "dynamodb-toolbox";
import { TestQueryTable } from "./table";

export const TestQueryEntity = new Entity({
  name: "Query",
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
  table: TestQueryTable,
});

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
  },
  table: TestQueryTable,
});

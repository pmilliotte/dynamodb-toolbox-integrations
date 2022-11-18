import { Entity } from "dynamodb-toolbox";
import { TestTable } from "./table";

export const TestEntity = new Entity({
  name: "Test",
  attributes: {
    type: {
      partitionKey: true,
      type: "string",
    },
    name: { sortKey: true, type: "string" },
  },
  table: TestTable,
});

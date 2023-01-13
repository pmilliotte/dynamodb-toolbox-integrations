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
    requiredNumber: { type: "number" },
    requiredString: { type: "string" },
    optionalString: { type: "string" },
  },
  table: TestUpdateTable,
});

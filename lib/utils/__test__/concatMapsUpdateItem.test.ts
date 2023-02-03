import { describe, expect, it } from "vitest";
import { Entity, Table } from "dynamodb-toolbox";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { concatMapsUpdateItem } from "../updateItem/concatMapsUpdateItem";

const documentClient = new DocumentClient({ region: "eu-west-1" });

export const TestTable = new Table({
  name: "Test",
  partitionKey: "type",
  sortKey: "id",
  DocumentClient: documentClient,
});

describe("valueToObjectUpdateItem", () => {
  it("should return all set s for entity with only required s entity and prefix or suffix", () => {
    const entity = new Entity({
      name: "Test",
      attributes: {
        pk: {
          partitionKey: true,
          type: "string",
        },
        sk: { sortKey: true, type: "string" },
        optionalString: { type: "string" },
      },
      table: TestTable,
    });

    const attributesExpected =
      "States.Format('{} {} {} {} {} {} {} {} {}', 'SET ', $.UpdateExpression['_md'], $.separator['optionalString'], $.UpdateExpression['optionalString'], $.separator['_ct'], $.UpdateExpression['_ct'], $.separator['_et'], $.UpdateExpression['_et'], '')";
    expect(
      concatMapsUpdateItem(
        // @ts-ignore
        entity,
        "$.UpdateExpression",
        "$.separator",
        "SET ",
        ""
      )
    ).toEqual(attributesExpected);
  });
});

import { assert, describe, expect, it } from "vitest";
import { Entity, Table } from "dynamodb-toolbox";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { applyAttributePropertiesUpdateItem } from "../applyAttributePropertiesUpdateItem";

const documentClient = new DocumentClient({ region: "eu-west-1" });

export const TestTable = new Table({
  name: "Test",
  partitionKey: "type",
  sortKey: "id",
  DocumentClient: documentClient,
});

describe("applyAttributePropertiesUpdateItem", () => {
  it("should return all set fields for entity with only required fields entity", () => {
    const fullRequiredEntity = new Entity({
      name: "Test",
      attributes: {
        type: {
          partitionKey: true,
          type: "string",
        },
        id: { sortKey: true, type: "string" },
        name: { type: "string", required: true },
        age: { type: "number", required: true },
      },
      table: TestTable,
    });

    const attributesExpected = {
      Key: {
        type: {
          "S.$": "States.Format('{}', $.type)",
        },
        id: {
          "S.$": "States.Format('{}', $.id)",
        },
      },
      UpdateExpression:
        "SET #name_ATTRIBUTE_ALIAS = :name, #age_ATTRIBUTE_ALIAS = :age, #_ct_ATTRIBUTE_ALIAS = :_ct, #_md_ATTRIBUTE_ALIAS = :_md",
      ExpressionAttributeNames: {
        "#name_ATTRIBUTE_ALIAS": "name",
        "#age_ATTRIBUTE_ALIAS": "age",
        "#_ct_ATTRIBUTE_ALIAS": "_ct",
        "#_md_ATTRIBUTE_ALIAS": "_md",
      },
      ExpressionAttributeValues: {
        ":age": {
          "N.$": "States.JsonToString($.age)",
        },
        ":name.$": "$.name",
        ":_ct.$": "$$.State.EnteredTime",
        ":_md.$": "$$.State.EnteredTime",
      },
    };
    // @ts-expect-error : entity doesn't extend dynamodb-toolbox entity type
    expect(applyAttributePropertiesUpdateItem(fullRequiredEntity)).toEqual(
      attributesExpected
    );
  });
});

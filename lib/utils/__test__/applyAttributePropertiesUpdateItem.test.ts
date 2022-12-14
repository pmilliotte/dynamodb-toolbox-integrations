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
  it("should return all set s for entity with only required s entity", () => {
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
          "S.$": "States.Format('{}',$.type)",
        },
        id: {
          "S.$": "States.Format('{}',$.id)",
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
        ":name.$": "States.Format('{}',$.name)",
        ":_ct.$": "States.Format('{}',$$.State.EnteredTime)",
        ":_md.$": "States.Format('{}',$$.State.EnteredTime)",
      },
    };
    // @ts-expect-error : entity doesn't extend dynamodb-toolbox entity type
    expect(applyAttributePropertiesUpdateItem(fullRequiredEntity)).toEqual(
      attributesExpected
    );
  });

  it("should return all set s for entity with only required s entity and prefix or suffix", () => {
    const fullRequiredEntity = new Entity({
      name: "Test",
      attributes: {
        type: {
          partitionKey: true,
          type: "string",
          prefix: "PK",
        },
        id: { sortKey: true, type: "string", suffix: "SK" },
        prefix: { type: "string", required: true, prefix: "PREFIX" },
        suffix: { type: "string", required: true, suffix: "SUFFIX" },
        prefixAndSuffix: {
          type: "string",
          required: true,
          suffix: "SUFFIX",
          prefix: "PREFIX",
        },
      },
      table: TestTable,
    });

    const attributesExpected = {
      Key: {
        type: {
          "S.$": "States.Format('PK{}',$.type)",
        },
        id: {
          "S.$": "States.Format('{}SK',$.id)",
        },
      },
      UpdateExpression:
        "SET #prefix_ATTRIBUTE_ALIAS = :prefix, #suffix_ATTRIBUTE_ALIAS = :suffix, #prefixAndSuffix_ATTRIBUTE_ALIAS = :prefixAndSuffix, #_ct_ATTRIBUTE_ALIAS = :_ct, #_md_ATTRIBUTE_ALIAS = :_md",
      ExpressionAttributeNames: {
        "#prefix_ATTRIBUTE_ALIAS": "prefix",
        "#suffix_ATTRIBUTE_ALIAS": "suffix",
        "#prefixAndSuffix_ATTRIBUTE_ALIAS": "prefixAndSuffix",
        "#_ct_ATTRIBUTE_ALIAS": "_ct",
        "#_md_ATTRIBUTE_ALIAS": "_md",
      },
      ExpressionAttributeValues: {
        ":prefix.$": "States.Format('PREFIX{}',$.prefix)",
        ":suffix.$": "States.Format('{}SUFFIX',$.suffix)",
        ":prefixAndSuffix.$":
          "States.Format('PREFIX{}SUFFIX',$.prefixAndSuffix)",
        ":_ct.$": "States.Format('{}',$$.State.EnteredTime)",
        ":_md.$": "States.Format('{}',$$.State.EnteredTime)",
      },
    };
    // @ts-expect-error : entity doesn't extend dynamodb-toolbox entity type
    expect(applyAttributePropertiesUpdateItem(fullRequiredEntity)).toEqual(
      attributesExpected
    );
  });
});

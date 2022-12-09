import { Entity } from "../types";
import { TYPE_MAPPING } from "../types/Entity";
import { DYNAMODB_TOOLBOX_GENERATED_ATTRIBUTE_ALIASES } from "./constants";

export const applyAttributePropertiesUpdateItem = (
  entity: Entity
): Record<string, unknown> => {
  const { attributes } = entity.schema;

  const params = Object.entries(
    entity.attributes as Record<
      string,
      { type: string; prefix: string; suffix: string }
    >
  ).reduce(
    (tempParams, [attributeKey, { type, prefix, suffix }], index) => {
      const attributeMap = attributes[attributeKey].map ?? attributeKey;
      const attributeAlias = attributes[attributeKey].alias ?? attributeKey;

      if (
        attributes[attributeKey].sortKey === true ||
        attributes[attributeKey].partitionKey === true
      ) {
        const key = `${TYPE_MAPPING[type]}.$`;
        const value = {
          [key]: `States.Format('${prefix ?? ""}{}${
            suffix ?? ""
          }',$.${attributeMap})`,
        };
        return {
          ...tempParams,
          Key: {
            ...tempParams.Key,
            [attributeMap]: value,
          },
        };
      }

      const alreadyHasAttributesToUpdate = tempParams.UpdateExpression !== "";

      const attributeNameAlias = `#${attributeMap}_ATTRIBUTE_NAME`;
      const dynamoDBAttributeExpression = `${
        !alreadyHasAttributesToUpdate ? "SET " : ""
      }${
        alreadyHasAttributesToUpdate ? ", " : ""
      }${attributeNameAlias} = :${attributeMap}`;

      const dynamoDBExpressionAttributeName = {
        [attributeNameAlias]: attributeMap,
      };

      const attributeValue =
        DYNAMODB_TOOLBOX_GENERATED_ATTRIBUTE_ALIASES.includes(attributeAlias)
          ? "$$.State.EnteredTime"
          : `$.${attributeMap}`;
      const dynamoDBExpressionAttributeValues =
        TYPE_MAPPING[type] === "S"
          ? {
              [`:${attributeMap}.$`]: `States.Format('${prefix ?? ""}{}${
                suffix ?? ""
              }',${attributeValue})`,
            }
          : {
              [`:${attributeMap}`]: {
                [`${TYPE_MAPPING[type]}.$`]: `States.JsonToString(${attributeValue})`,
              },
            };

      return {
        ...tempParams,
        ExpressionAttributeNames: {
          ...tempParams.ExpressionAttributeNames,
          ...dynamoDBExpressionAttributeName,
        },
        ExpressionAttributeValues: {
          ...tempParams.ExpressionAttributeValues,
          ...dynamoDBExpressionAttributeValues,
        },
        UpdateExpression:
          tempParams.UpdateExpression + dynamoDBAttributeExpression,
      };
    },
    {
      Key: {},
      UpdateExpression: "",
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
    } as {
      Key: Record<string, unknown>;
      UpdateExpression: string;
      ExpressionAttributeNames: Record<string, unknown>;
      ExpressionAttributeValues: Record<string, unknown>;
    }
  );

  return params;
};

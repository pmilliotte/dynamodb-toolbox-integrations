import intersection from "lodash/intersection";
import uniq from "lodash/uniq";
import { Entity } from "../types";

export const getAttributeMaps = (entity: Entity): string[] =>
  uniq(
    Object.keys(entity.schema.attributes).map(
      (attributeKey) =>
        entity.schema.attributes[attributeKey].map ?? attributeKey
    )
  );

export const getAttributeAliases = (entity: Entity): string[] =>
  uniq(
    Object.keys(entity.schema.attributes).map(
      (attributeKey) =>
        entity.schema.attributes[attributeKey].alias ?? attributeKey
    )
  );

export const getKeyAliases = (entity: Entity) =>
  uniq(
    Object.keys(entity.schema.attributes)
      .filter(
        (attributeKey) =>
          !!entity.schema.attributes[attributeKey].partitionKey ||
          !!entity.schema.attributes[attributeKey].sortKey
      )
      .map(
        (attributeKey) =>
          entity.schema.attributes[attributeKey].alias ?? attributeKey
      )
  );

export const getPartitionKeyAlias = (entity: Entity) => {
  const attributeKey = Object.keys(entity.schema.attributes).find(
    (attributeKey) => !!entity.schema.attributes[attributeKey].partitionKey
  );

  if (attributeKey === undefined) {
    throw new Error("Entity must have a partition key");
  }

  return entity.schema.attributes[attributeKey].alias ?? attributeKey;
};

export const aliasToMap = (
  entity: Entity,
  inputAliases?: string[]
): string[] => {
  const entityAliases = getAttributeAliases(entity);
  const aliases = intersection(inputAliases ?? entityAliases, entityAliases);

  return uniq(
    Object.keys(entity.schema.attributes)
      .filter(
        (attributeKey) =>
          aliases?.includes(entity.schema.attributes[attributeKey].alias) ||
          aliases?.includes(attributeKey)
      )
      .map(
        (attributeKey) =>
          entity.schema.attributes[attributeKey].map ?? attributeKey
      )
  );
};

export const getExpressionProperties = (
  entity: Entity,
  inputAliases?: string[]
) => {
  const maps = aliasToMap(entity, inputAliases);

  if (maps.length === 0) {
    return {
      ProjectionExpression: undefined,
      ExpressionAttributeNames: undefined,
    };
  }
  return maps.reduce(
    (acc, map, index) => {
      const separator = acc.ProjectionExpression === "" ? "" : ", ";
      return {
        ProjectionExpression: acc.ProjectionExpression.concat(
          `${separator}#${index}`
        ),
        ExpressionAttributeNames: {
          ...acc.ExpressionAttributeNames,
          [`#${index}`]: map,
        },
      };
    },
    { ProjectionExpression: "", ExpressionAttributeNames: {} }
  );
};

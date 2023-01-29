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
    Object.keys(entity.schema.attributes).filter(
      (attributeKey) =>
        !!entity.schema.attributes[attributeKey].partitionKey ||
        !!entity.schema.attributes[attributeKey].sortKey
    )
  ).map(
    (attributeKey) =>
      entity.schema.attributes[attributeKey].alias ?? attributeKey
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

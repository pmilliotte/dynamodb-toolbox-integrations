import { Entity } from "../../types";

export const applyKeyAttributePropertiesForUser = (
  entity: Entity
): Record<string, unknown> => {
  const { attributes } = entity.schema;

  const keyEntries = Object.entries(
    entity.attributes as Record<
      string,
      {
        partitionKey?: string | boolean;
        sortKey?: string | boolean;
      }
    >
  ).filter(([key, value]) => !!value.partitionKey || !!value.sortKey);

  console.log("keyEntries", keyEntries);
  const params = keyEntries.reduce((tempParams, [attributeKey, _]) => {
    const attributeMap = attributes[attributeKey].map ?? attributeKey;
    const attributeAlias = attributes[attributeKey].alias ?? attributeKey;
    return {
      ...tempParams,
      [`${attributeAlias}.$`]: `$.${attributeMap}`,
    };
  }, {} as Record<string, unknown>);

  return params;
};

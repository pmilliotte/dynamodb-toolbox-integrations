import { Entity } from "../types";
import { TYPE_MAPPING } from "../types/Entity";
import { getAttributeMaps } from "./attributes";

export const aliasToMap = (
  entity: Entity,
  jsonPath: string = "$"
): Record<string, unknown> => {
  const attributeMaps = getAttributeMaps(entity);

  const params = attributeMaps.reduce((tempParams, attributeMap) => {
    const { type, alias } = entity.schema.attributes[attributeMap];
    return {
      ...tempParams,
      [`${attributeMap}.$`]: `${jsonPath}.${alias ?? attributeMap}.${
        TYPE_MAPPING[type]
      }`,
    };
  }, {} as Record<string, unknown>);

  return params;
};

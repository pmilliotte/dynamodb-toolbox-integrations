import { Entity } from "../types";
import { getAttributeMaps } from "./attributes";

export const aliasToMap = (
  entity: Entity,
  jsonPath: string = "$"
): Record<string, unknown> => {
  const attributeMaps = getAttributeMaps(entity);

  const params = attributeMaps.reduce((tempParams, attributeMap) => {
    const { alias } = entity.schema.attributes[attributeMap];

    return {
      ...tempParams,
      [`${attributeMap}.$`]: `${jsonPath}.${alias ?? attributeMap}`,
    };
  }, {} as Record<string, unknown>);

  return params;
};

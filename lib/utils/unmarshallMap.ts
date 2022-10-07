import { Entity } from "../types";
import { TYPE_MAPPING } from "../types/Entity";
import { getAttributeMaps } from "./attributes";

export const unmarshallMap = (
  entity: Entity,
  jsonPath: string = "$"
): Record<string, unknown> => {
  const attributeMaps = getAttributeMaps(entity);

  const params = attributeMaps.reduce((tempParams, attributeMap) => {
    const { type } = entity.schema.attributes[attributeMap];
    return {
      ...tempParams,
      [`${attributeMap}.$`]: `${jsonPath}.${attributeMap}.${
        TYPE_MAPPING[type]
      }`,
    };
  }, {} as Record<string, unknown>);

  return params;
};

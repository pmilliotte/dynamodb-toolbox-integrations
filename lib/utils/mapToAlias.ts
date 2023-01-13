import { Entity } from "../types";
import { getAttributeAliases } from "./attributes";

export const mapToAlias = (
  entity: Entity,
  jsonPath: string = "$"
): Record<string, unknown> => {
  const keyAliases = getAttributeAliases(entity);

  const params = keyAliases.reduce((tempParams, keyAlias) => {
    const { type, map } = entity.schema.attributes[keyAlias];
    return {
      ...tempParams,
      [`${keyAlias}.$`]: `${jsonPath}.${map ?? keyAlias}`,
    };
  }, {} as Record<string, unknown>);

  return params;
};

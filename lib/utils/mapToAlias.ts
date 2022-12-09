import { Entity } from "../types";
import { TYPE_MAPPING } from "../types/Entity";
import { getAttributeAliases } from "./attributes";

export const mapToAlias = (entity: Entity): Record<string, unknown> => {
  const keyAliases = getAttributeAliases(entity);

  const params = keyAliases.reduce((tempParams, keyAlias) => {
    const { type, map } = entity.schema.attributes[keyAlias];
    return {
      ...tempParams,
      [`${keyAlias}.$`]: `$.output.${map ?? keyAlias}.${TYPE_MAPPING[type]}`,
    };
  }, {} as Record<string, unknown>);

  return params;
};

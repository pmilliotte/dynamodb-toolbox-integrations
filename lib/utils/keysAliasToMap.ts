import { Entity } from "../types";
import { TYPE_MAPPING } from "../types/Entity";
import { getKeyAliases } from "./attributes";

export const keysAliasToMap = (entity: Entity): Record<string, unknown> => {
  const keyAliases = getKeyAliases(entity);

  const params = keyAliases.reduce((tempParams, keyAlias) => {
    const { type, map } = entity.schema.attributes[keyAlias];

    return {
      ...tempParams,
      [`${map ?? keyAlias}`]: { [`${TYPE_MAPPING[type]}.$`]: `$.${keyAlias}` },
    };
  }, {} as Record<string, unknown>);

  return params;
};

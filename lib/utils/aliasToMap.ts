import { Entity } from "../types";
import { getKeyAliases } from "./attributes";

export const aliasToMap = (entity: Entity): Record<string, unknown> => {
  const keyAliases = getKeyAliases(entity);

  const params = keyAliases.reduce((tempParams, keyAlias) => {
    return {
      ...tempParams,
      [`${
        entity.schema.attributes[keyAlias].map ?? keyAlias
      }.$`]: `$.${keyAlias}`,
    };
  }, {} as Record<string, unknown>);

  return params;
};

import { Entity } from "../types";
import { TYPE_MAPPING } from "../types/Entity";
import { getAttributeMaps } from "./attributes";

export const getPlaceHolderNullValues = (
  entity: Entity
): Record<string, string> => {
  const params = getAttributeMaps(entity).reduce((temporaryParams, map) => {
    const { type } = entity.schema.attributes[map];
    const key = TYPE_MAPPING[type];
    return {
      ...temporaryParams,
      [map]: { [key]: null },
    };
  }, {});

  return params;
};

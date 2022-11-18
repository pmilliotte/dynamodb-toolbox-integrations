import { Entity } from "../types";
import { getAttributeMaps } from "./attributes";

export const getFirstItem = (entity: Entity): Record<string, string> => {
  const params = getAttributeMaps(entity).reduce(
    (temporaryParams, attributeMap) => ({
      ...temporaryParams,
      [`${attributeMap}.$`]: `$.object.${attributeMap}[0][0]`,
    }),
    {}
  );

  return params;
};

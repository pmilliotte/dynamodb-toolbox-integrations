import { Entity } from "../types";
import { getAttributeMaps } from "./attributes";

export const mapValuesToArray = (
  entity: Entity,
  jsonPath: string = "$"
): Record<string, string> => {
  const attributeMaps = getAttributeMaps(entity);

  const params = attributeMaps.reduce(
    (temporaryParams, attributeMap) => ({
      ...temporaryParams,
      [`${attributeMap}.$`]: `States.Array(${jsonPath}['${attributeMap}'])`,
    }),
    {}
  );

  return params;
};

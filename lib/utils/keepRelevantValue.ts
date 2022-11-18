import { Entity } from "../types";
import { getAttributeMaps } from "./attributes";

export const keepRelevantValue = (entity: Entity): Record<string, string> => {
  const params = getAttributeMaps(entity).reduce(
    (temporaryParams, attributeMap) => ({
      ...temporaryParams,
      [`${attributeMap}.$`]: `$..arrays[?(@.attributeMap=='${attributeMap}' && @.length == 1)].value[0]`,
    }),
    {}
  );

  return params;
};

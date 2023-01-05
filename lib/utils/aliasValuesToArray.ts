import { Entity } from "../types";
import { getAttributeAliases } from "./attributes";

export const aliasValuesToArray = (
  entity: Entity,
  jsonPath: string = "$"
): Record<string, string> => {
  const attributeAliases = getAttributeAliases(entity);

  const params = attributeAliases.reduce(
    (temporaryParams, attributeAlias) => ({
      ...temporaryParams,
      [`${attributeAlias}.$`]: `States.Array(${jsonPath}['${attributeAlias}'])`,
    }),
    {}
  );

  return params;
};

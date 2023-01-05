import { Entity } from "../types";
import { getAttributeAliases, getAttributeMaps } from "./attributes";

export const aliasToArray = (
  entity: Entity,
  jsonPath: string = "$"
): string => {
  const string = "States.Array(";

  const attributeAliases = getAttributeAliases(entity);

  const params = attributeAliases.reduce(
    (temporaryParams, attributeAlias, index) =>
      temporaryParams.concat(
        `${jsonPath}['${attributeAlias}']${
          index === attributeAliases.length - 1 ? "" : ","
        }`
      ),
    string
  );

  return params.concat(")");
};

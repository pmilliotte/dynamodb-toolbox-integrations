import { Entity } from "../types";
import { getAttributeAliases } from "./attributes";

export const getPlaceholderInputValues = (
  entity: Entity
): Record<string, string> => {

  const params = getAttributeAliases(entity).reduce(
    (temporaryParams, alias) => ({
      ...temporaryParams,
      [`${alias}.$`]: "$.uuid",
    }),
    {}
  );

  return params;
};

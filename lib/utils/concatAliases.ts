import { Entity } from "../types";
import { getAttributeAliases } from "./attributes";

export const concatAliases = (
  entity: Entity,
  jsonPath: string,
  separatorPath: string
): string => {
  const aliases = getAttributeAliases(entity).sort((aliasA, _) => {
    const { required } = entity.schema.attributes[aliasA];

    if (required === true) return 1;

    return 0;
  });
  // TODO: sort attributeNames with required attributes first
  const string = aliases.reduce((currentString, _) => {
    return currentString.concat("{} {} ");
  }, "States.Format(' ");

  const format = aliases.reduce((currentString, attributeName, index) => {
    const separator = index === 0 ? "" : `, ${separatorPath}['${attributeName}']`;

    return currentString.concat(`${separator}, ${jsonPath}['${attributeName}']`);
  }, string.concat(" {}', '{' "));

  return format.concat(" , '}')");
};

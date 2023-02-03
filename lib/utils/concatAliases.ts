import { Entity } from "../types";
import { getAttributeAliases } from "./attributes";

export const concatAliases = (
  entity: Entity,
  jsonPath: string,
  separatorPath: string,
): string => {
  const aliases = getAttributeAliases(entity);

  // TODO: sort attributeNames with required attributes first
  const string = aliases.reduce((currentString, _) => {
    return currentString.concat("{} {} ");
  }, "States.Format(' ");

  const format = aliases.reduce((currentString, attributeName, index) => {
    const separator = `, ${separatorPath}['${attributeName}']`;

    return currentString.concat(
      `${separator}, ${jsonPath}['${attributeName}']`
    );
  }, string.concat(" {} {} {}', '{', $.notNullValue  "));

  return format.concat(" , '}')");
};

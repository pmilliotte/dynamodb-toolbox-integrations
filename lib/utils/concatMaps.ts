import { Entity } from "../types";
import { getAttributeMaps } from "./attributes";

export const concatMaps = (
  entity: Entity,
  jsonPath: string,
  separatorPath: string
): string => {
  const maps = getAttributeMaps(entity).sort((mapA, _) => {
    const { required } = entity.schema.attributes[mapA];

    if (required === true) return 1;

    return 0;
  });
  // TODO: sort attributeNames with required attributes first
  const string = maps.reduce((currentString, _) => {
    return currentString.concat("{} {} ");
  }, "States.Format(' ");

  const format = maps.reduce((currentString, attributeName, index) => {
    const separator = index === 0 ? "" : `, ${separatorPath}['${attributeName}']`;

    return currentString.concat(`${separator}, ${jsonPath}['${attributeName}']`);
  }, string.concat(" {}', '{' "));


  return format.concat(" , '}')");
};

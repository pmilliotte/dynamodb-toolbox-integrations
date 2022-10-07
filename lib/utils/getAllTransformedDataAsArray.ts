import { Entity } from "../types";

export const getAllTransformedDataAsArray = (entity: Entity): string => {
  const { attributes } = entity.schema;

  const string = "States.Array(";
  let index = Object.keys(entity.attributes).length;

  const params = Object.entries(
    entity.attributes as Record<string, { type: string }>
  ).reduce((temporaryString, [attributeKey]) => {
    index = index - 1;
    const attributeMap = attributes[attributeKey].map ?? attributeKey;

    return temporaryString.concat(
      `$.arrays['${attributeMap}.placeholder'], $.arrays['${attributeMap}.input'], $.arrays['${attributeMap}.null']${
        index === 0 ? "" : ","
      } `
    );
  }, string);

  return params.concat(")");
};

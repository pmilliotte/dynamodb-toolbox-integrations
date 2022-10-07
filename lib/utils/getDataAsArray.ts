import { Entity } from "../types";

export const getDataAsArray = (entity: Entity): string => {
  const { attributes } = entity.schema;

  const string = "States.Array(";
  let index = Object.keys(entity.attributes).length;

  const params = Object.entries(
    entity.attributes as Record<string, unknown>
  ).reduce((temporaryParams, [attributeKey]) => {
    index = index - 1;
    const attributeMap = attributes[attributeKey].map ?? attributeKey;

    return temporaryParams.concat(
      `$.data['${attributeMap}']${index === 0 ? "" : ","}`
    );
  }, string);

  return params.concat(")");
};

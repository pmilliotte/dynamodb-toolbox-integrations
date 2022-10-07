import { Entity } from "../types";

export const getFirstItem = (entity: Entity): Record<string, string> => {
  const { attributes } = entity.schema;

  const params = Object.keys(
    entity.attributes as Record<string, { type: string }>
  ).reduce((temporaryParams, attributeKey) => {
    const attributeMap = attributes[attributeKey].map ?? attributeKey;

    return {
      ...temporaryParams,
      [`${attributeMap}.$`]: `$.object.${attributeMap}[0][0]`,
    };
  }, {});

  return params;
};

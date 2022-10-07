import { Entity } from "../types";

export const mapToArray = (entity: Entity): Record<string, string> => {
  const { attributes } = entity.schema;

  const params = Object.keys(
    entity.attributes as Record<string, unknown>
  ).reduce((temporaryParams, attributeKey) => {
    const attributeMap = attributes[attributeKey].map ?? attributeKey;
    const attributeAlias = attributes[attributeKey].alias ?? attributeKey;

    return {
      ...temporaryParams,
      [`${attributeMap}.$`]: `States.Array($.data['${attributeAlias}'])`,
    };
  }, {});

  return params;
};

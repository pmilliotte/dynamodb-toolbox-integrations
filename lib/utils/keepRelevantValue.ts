import { Entity } from "../types";

export const keepRelevantValue = (entity: Entity): Record<string, string> => {
  const { attributes } = entity.schema;

  const params = Object.keys(
    entity.attributes as Record<string, { type: string }>
  ).reduce((temporaryParams, attributeKey) => {
    const attributeMap = attributes[attributeKey].map ?? attributeKey;

    return {
      ...temporaryParams,
      [`${attributeMap}.$`]: `$..arrays[?(@.attributeMap=='${attributeMap}' && @.length == 1)].value[0]`,
    };
  }, {});

  return params;
};

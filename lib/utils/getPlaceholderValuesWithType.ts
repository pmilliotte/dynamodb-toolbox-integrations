import { Entity } from "../types";
import { TYPE_MAPPING } from "../types/Entity";

export const getPlaceholderValuesWithType = (
  attributes: string[],
  entity: Entity
): Record<string, string> => {
  const params = attributes.reduce((temporaryParams, attributeName) => {
    const { type } = entity.schema.attributes[attributeName];
    const key = `${TYPE_MAPPING[type]}.$`;

    return {
      ...temporaryParams,
      [`${attributeName}`]: { [key]: "$.uuid" },
    };
  }, {});

  return params;
};

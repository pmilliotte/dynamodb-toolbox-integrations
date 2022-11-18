import { Entity } from "../types";
import { EntityAttributes } from "../types/Entity";

export const mapToArray = (entity: Entity): Record<string, string> => {
  const { attributes } = entity.schema;

  // TODO Optimize with a map uniq 
  const params = Object.keys(attributes as EntityAttributes).reduce(
    (temporaryParams, attributeKey) => {
      const attributeMap = attributes[attributeKey].map ?? attributeKey;
      const attributeAlias = attributes[attributeKey].alias ?? attributeKey;

      return {
        ...temporaryParams,
        [`${attributeMap}.$`]: `States.Array($.data['${attributeAlias}'])`,
      };
    },
    {}
  );

  return params;
};

import { Entity } from "../types";
import { TYPE_MAPPING } from "../types/Entity";
import { getAttributeMaps } from "./attributes";

export const applyAttributeProperties = (
  entity: Entity
): Record<string, unknown> => {
  const nullValue = entity.table.removeNullAttributes
    ? null
    : {
        NULL: true,
      };

  const params = getAttributeMaps(entity).reduce((tempParams, attributeMap) => {
    const { type, prefix, suffix } = entity.schema.attributes[attributeMap];
    const key = `${TYPE_MAPPING[type]}.$`;
    const value = {
      [key]: `States.Format('${prefix ?? ""}{}${
        suffix ?? ""
      }', $.data['${attributeMap}'][0])`,
    };

    return {
      ...tempParams,
      [attributeMap]: {
        value: [value],
        "isPlaceholder.$": `States.ArrayContains($.data['${attributeMap}'], $.uuid)`,
        "isNull.$": `States.ArrayContains($.data['${attributeMap}'], null)`,
        // Need to set it as array to be able to get null value if removeNullAttributes is true, because Dynamodb does not support Null properties set to false
        attributeMap,
        nullValue: [null],
        null2Value: [nullValue],
      },
    };
  }, {} as Record<string, unknown>);

  return params;
};

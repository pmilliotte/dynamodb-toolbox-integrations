import { Entity } from "../types";

export const separateFromPlaceholder = (
  entity: Entity
): Record<string, string> => {
  const { attributes } = entity.schema;

  const params = Object.keys(
    entity.attributes as Record<string, unknown>
  ).reduce((temporaryParams, attributeKey) => {
    const attributeMap = attributes[attributeKey].map ?? attributeKey;

    return {
      ...temporaryParams,
      [`${attributeMap}.placeholder`]: {
        "value.$": `$.array[?(@.attributeMap=='${attributeMap}' && @.isPlaceholder == true)].nullValue`,
        // 0 or 1
        "length.$": `States.ArrayLength($.array[?(@.attributeMap=='${attributeMap}' && @.isPlaceholder == true)].nullValue)`,
        attributeMap,
      },
      [`${attributeMap}.null`]: {
        "value.$": `$.array[?(@.attributeMap=='${attributeMap}' && @.isNull == true)].null2Value`,
        // 0 or 1
        "length.$": `States.ArrayLength($.array[?(@.attributeMap=='${attributeMap}' && @.isNull == true)].null2Value)`,
        attributeMap,
      },
      [`${attributeMap}.input`]: {
        "value.$": `$.array[?(@.attributeMap=='${attributeMap}' && @.isPlaceholder == false && @.isNull == false)].value`,
        // 0 or 1
        "length.$": `States.ArrayLength($.array[?(@.attributeMap=='${attributeMap}' && @.isPlaceholder == false && @.isNull == false)].value)`,
        attributeMap,
      },
    };
  }, {});

  return params;
};

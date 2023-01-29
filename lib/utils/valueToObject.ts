import { Entity } from "../types";
import { TYPE_MAPPING } from "../types/Entity";

export const valueToObject = (
  attributeNames: string[],
  jsonPath: string = "$",
  marshallEntity?: Entity
): Record<string, unknown> => {
  return attributeNames.reduce((tempParams, attributeName) => {
    let attributeValue: Record<string, unknown> = {
      "value.$": `${jsonPath}.['${attributeName}'][0]`,
    };
    let valuePath: string;

    if (marshallEntity !== undefined) {
      const { type, prefix, suffix } =
        marshallEntity.schema.attributes[attributeName];

      switch (type) {
        case "number":
          valuePath = `States.JsonToString(${jsonPath}.['${attributeName}'][0])`;
          break;
        case "string":
          valuePath = `States.Format('${prefix ?? ""}{}${
            suffix ?? ""
          }', ${jsonPath}.['${attributeName}'][0])`;
          break;
        default:
          valuePath = `${jsonPath}.['${attributeName}'][0]`;
      }
      attributeValue = {
        value: {
          [`${TYPE_MAPPING[type]}.$`]: valuePath,
        },
      };
    }

    return {
      ...tempParams,
      [attributeName]: {
        ...attributeValue,
        "isPlaceholder.$": `States.ArrayContains(${jsonPath}.['${attributeName}'], $.uuid)`,
        "isNull.$": `States.ArrayContains(${jsonPath}.['${attributeName}'], null)`,
        attributeName: attributeName,
      },
    };
  }, {} as Record<string, unknown>);
};

import { Entity } from "../../types";
import { TYPE_MAPPING } from "../../types/Entity";

export const valueToObjectUpdateItem = (
  attributeNames: string[],
  jsonPath: string = "$",
  marshallEntity?: Entity
): Record<string, unknown> => {
  return attributeNames.reduce((tempParams, attributeName) => {
    let attributeValue: Record<string, unknown> = {
      "ExpressionAttributeValue.$": `${jsonPath}.['${attributeName}'][0]`,
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
        ExpressionAttributeValue: {
          [`${TYPE_MAPPING[type]}.$`]: valuePath,
        },
      };
    }

    const attributeNameAlias = `#${attributeName}_ATTRIBUTE_ALIAS`;

    const UpdateExpressionToConcat = `${attributeNameAlias} = :${attributeName}`;

    const ExpressionAttributeNameToConcat = `"${attributeNameAlias}": "${attributeName}"`;

    return {
      ...tempParams,
      [attributeName]: {
        attributeValue,
        ExpressionAttributeNameToConcat,
        UpdateExpressionToConcat,
        "isPlaceholder.$": `States.ArrayContains(${jsonPath}.['${attributeName}'], $.uuid)`,
        "isNull.$": `States.ArrayContains(${jsonPath}.['${attributeName}'], null)`,
        attributeName,
      },
    };
  }, {} as Record<string, unknown>);
};

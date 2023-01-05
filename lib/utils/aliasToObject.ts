import { Entity } from "../types";
import { getAttributeAliases } from "./attributes";

export const aliasToObject = (
  entity: Entity,
  jsonPath: string = "$"
): Record<string, unknown> => {
  const attributeAliases = getAttributeAliases(entity);

  return attributeAliases.reduce(
    (tempParams, attributeAlias) => ({
      ...tempParams,
      [attributeAlias]: {
        "value.$": `${jsonPath}.['${attributeAlias}'][0]`,
        "isPlaceholder.$": `States.ArrayContains(${jsonPath}.['${attributeAlias}'], $.uuid)`,
        "isNull.$": `States.ArrayContains(${jsonPath}.['${attributeAlias}'], null)`,
        // Need to set it as array to be able to get null value if removeNullAttributes is true, because Dynamodb does not support Null properties set to false
        attributeName: attributeAlias,
        "valueToConcat.$": `States.Format('${'\"' + attributeAlias + '\"'}: ${'\"'}{}${'\"'}', ${jsonPath}.['${attributeAlias}'][0])`,
        nullValue: null,
        null2Value: null,
      },
    }),
    {} as Record<string, unknown>
  );
};

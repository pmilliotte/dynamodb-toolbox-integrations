import { Entity } from "../../types";

export const mergeWithValueToConcatUpdateItem = (
  attributeNames: string[],
  entity: Entity,
  jsonPath: string = "$"
): Record<string, unknown> =>
  attributeNames.reduce(
    (tempParams, attributeName) => ({
      ...tempParams,
      [attributeName]: {
        "isPlaceholder.$": `${jsonPath}.['${attributeName}'].isPlaceholder`,
        "isNull.$": `${jsonPath}.['${attributeName}'].isNull`,
        "attributeName.$": `${jsonPath}.['${attributeName}'].attributeName`,
        "ExpressionAttributeNameToConcat.$": `${jsonPath}.['${attributeName}'].ExpressionAttributeNameToConcat`,
        "UpdateExpressionToConcat.$": `${jsonPath}.['${attributeName}'].UpdateExpressionToConcat`,
        "ExpressionAttributeValueToConcat.$": `States.Format('${
          `"${
            attributeName !== entity.sortKey.toString() &&
            attributeName !== entity.partitionKey.toString()
              ? ":"
              : ""
          }` +
          attributeName +
          '"'
        }: {}', States.JsonToString(${jsonPath}.['${attributeName}'].attributeValue.ExpressionAttributeValue))`,
        nullValue: null,
        null2Value: null,
      },
    }),
    {} as Record<string, unknown>
  );

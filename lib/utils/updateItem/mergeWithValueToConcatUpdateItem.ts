export const mergeWithValueToConcatUpdateItem = (
  attributeNames: string[],
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
          '":' + attributeName + '"'
        }: {}', States.JsonToString(${jsonPath}.['${attributeName}'].attributeValue))`,
        nullValue: null,
        null2Value: null,
      },
    }),
    {} as Record<string, unknown>
  );

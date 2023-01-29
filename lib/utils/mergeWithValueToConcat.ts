export const mergeWithValueToConcat = (
  attributeNames: string[],
  jsonPath: string = "$"
): Record<string, unknown> =>
  attributeNames.reduce(
    (tempParams, attributeName) => ({
      ...tempParams,
      [attributeName]: {
        "isPlaceholder.$": `${jsonPath}['${attributeName}'].isPlaceholder`,
        "isNull.$": `${jsonPath}['${attributeName}'].isNull`,
        "attributeName.$": `${jsonPath}['${attributeName}'].attributeName`,
        "valueToConcat.$": `States.Format('${
          '"' + attributeName + '"'
        }: {}', States.JsonToString(${jsonPath}['${attributeName}'].value))`,
        nullValue: null,
        null2Value: null,
      },
    }),
    {} as Record<string, unknown>
  );

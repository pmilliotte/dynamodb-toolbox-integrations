export const separateFromPlaceholderUpdateItem = (
  attributes: string[],
  jsonPath: string,
  removePlaceholder: boolean = false
): Record<string, string> => {
  const params = attributes.reduce(
    (temporaryParams, attribute) => ({
      ...temporaryParams,
      ...(removePlaceholder
        ? {}
        : {
            [`${attribute}.placeholder`]: {
              // 0 or 1
              "length.$": `States.ArrayLength(${jsonPath}[?(@.attributeName=='${attribute}' && @.isPlaceholder == true)])`,
              attributeName: attribute,
              dataType: "placeholder",
              valueToConcat: [""],
              separator: [""],
            },
          }),
      [`${attribute}.null`]: {
        // 0 or 1
        "length.$": `States.ArrayLength(${jsonPath}[?(@.attributeName=='${attribute}' && @.isNull == true)])`,
        attributeName: attribute,
        valueToConcat: [`${attribute}: null, `],
        separator: [","],
      },
      [`${attribute}.ExpressionAttributeNameToConcat`]: {
        // 0 or 1
        "length.$": `States.ArrayLength(${jsonPath}[?(@.attributeName=='${attribute}' && @.isPlaceholder == false && @.isNull == false)])`,
        attributeName: attribute,
        dataType: "ExpressionAttributeName",
        "valueToConcat.$": `${jsonPath}[?(@.attributeName=='${attribute}')]['ExpressionAttributeNameToConcat']`,
        separator: [","],
      },
      [`${attribute}.UpdateExpressionToConcat`]: {
        // 0 or 1
        "length.$": `States.ArrayLength(${jsonPath}[?(@.attributeName=='${attribute}' && @.isPlaceholder == false && @.isNull == false)])`,
        attributeName: attribute,
        dataType: "UpdateExpression",
        "valueToConcat.$": `${jsonPath}[?(@.attributeName=='${attribute}')]['UpdateExpressionToConcat']`,
        separator: [","],
      },
      [`${attribute}.ExpressionAttributeValueToConcat`]: {
        // 0 or 1
        "length.$": `States.ArrayLength(${jsonPath}[?(@.attributeName=='${attribute}' && @.isPlaceholder == false && @.isNull == false)])`,
        attributeName: attribute,
        dataType: "ExpressionAttributeValue",
        "valueToConcat.$": `${jsonPath}[?(@.attributeName=='${attribute}')]['ExpressionAttributeValueToConcat']`,
        separator: [","],
      },
    }),
    {}
  );

  return params;
};

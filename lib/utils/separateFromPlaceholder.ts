export const separateFromPlaceholder = (
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
      [`${attribute}.input`]: {
        // 0 or 1
        "length.$": `States.ArrayLength(${jsonPath}[?(@.attributeName=='${attribute}' && @.isPlaceholder == false && @.isNull == false)])`,
        attributeName: attribute,
        "valueToConcat.$": `${jsonPath}[?(@.attributeName=='${attribute}')]['valueToConcat']`,
        separator: [","],
      },
    }),
    {
      "notNullValue.$": `${jsonPath}[?(@.isPlaceholder == false && @.isNull == false)]['valueToConcat']`,
    }
  );

  return params;
};

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
              value: null,
              // 0 or 1
              "length.$": `States.ArrayLength(${jsonPath}[?(@.attributeName=='${attribute}' && @.isPlaceholder == true)])`,
              attributeName: attribute,
              valueToConcat: [""],
              separator: [""],
            },
          }),
      [`${attribute}.null`]: {
        value: null,
        // 0 or 1
        "length.$": `States.ArrayLength(${jsonPath}[?(@.attributeName=='${attribute}' && @.isNull == true)])`,
        attributeName: attribute,
        valueToConcat: [`${attribute}: null, `],
        separator: [","],
      },
      [`${attribute}.input`]: {
        "value.$": `${jsonPath}[?(@.attributeName=='${attribute}' && @.isPlaceholder == false && @.isNull == false)].value`,
        // 0 or 1
        "length.$": `States.ArrayLength(${jsonPath}[?(@.attributeName=='${attribute}' && @.isPlaceholder == false && @.isNull == false)])`,
        attributeName: attribute,
        "valueToConcat.$": `${jsonPath}[?(@.attributeName=='${attribute}')]['valueToConcat']`,
        separator: [","],
      },
    }),
    {}
  );

  return params;
};

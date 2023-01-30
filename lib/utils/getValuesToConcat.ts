export const getValuesToConcat = (
  attributeNames: string[],
  jsonPath: string,
  propertyName: string,
  dataType?: string
): Record<string, unknown> => {
  const params = attributeNames.reduce(
    (temporaryParams, attributeName) => ({
      ...temporaryParams,
      [`${attributeName}.$`]: `${jsonPath}[?(@.attributeName=='${attributeName}' && @.length == 1${
        dataType
          ? ` && @.dataType==${dataType} || @.attributeName=='${attributeName}' && @.length == 1 && @.dataType==placeholder`
          : ""
      })].${propertyName}[0]`,
    }),
    {}
  );

  return params;
};

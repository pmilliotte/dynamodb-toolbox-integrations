export const getValuesToConcat = (
  attributeNames: string[],
  jsonPath: string,
  propertyName: string
): Record<string, unknown> => {
  const params = attributeNames.reduce(
    (temporaryParams, attributeName) => ({
      ...temporaryParams,
      [`${attributeName}.$`]: `${jsonPath}[?(@.attributeName=='${attributeName}' && @.length == 1)].${propertyName}[0]`,
    }),
    {}
  );

  return params;
};

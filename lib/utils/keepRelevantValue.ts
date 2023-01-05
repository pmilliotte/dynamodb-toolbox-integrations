export const keepRelevantValue = (
  attributeNames: string[],
  jsonPath: string
): Record<string, string> => {
  const params = attributeNames.reduce(
    (temporaryParams, attributeName) => ({
      ...temporaryParams,
      [`${attributeName}.$`]: `${jsonPath}[?(@.attributeName=='${attributeName}' && @.length == 1)].value[0]`,
    }),
    {}
  );

  return params;
};

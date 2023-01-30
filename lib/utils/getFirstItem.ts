export const getFirstItem = (
  attributeNames: string[],
  jsonPath: string
): Record<string, string> => {
  const params = attributeNames.reduce(
    (temporaryParams, attributeName) => ({
      ...temporaryParams,
      [`${attributeName}.$`]: `${jsonPath}.${attributeName}[0]`,
    }),
    {}
  );

  return params;
};

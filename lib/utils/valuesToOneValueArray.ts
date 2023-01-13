export const valuesToOneValueArray = (
  attributeNames: string[],
  jsonPath: string = "$"
): Record<string, string> => {
  const params = attributeNames.reduce(
    (temporaryParams, attributeName) => ({
      ...temporaryParams,
      [`${attributeName}.$`]: `States.Array(${jsonPath}['${attributeName}'])`,
    }),
    {}
  );

  return params;
};

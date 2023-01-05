export const getPlaceholderValues = (
  attributes: string[]
): Record<string, string> => {
  const params = attributes.reduce(
    (temporaryParams, attributeName) => ({
      ...temporaryParams,
      [`${attributeName}.$`]: "$.uuid",
    }),
    {}
  );

  return params;
};

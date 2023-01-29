export const getAllTransformedDataAsArray = (
  attributeNames: string[],
  jsonPath: string,
  removePlaceholder: boolean = false
): string => {
  const beginningString = "States.Array(";

  const params = attributeNames.reduce(
    (temporaryString, attributeName, index) => {
      const placeholder = removePlaceholder
        ? ""
        : `${jsonPath}['${attributeName}.placeholder'], `;

      return temporaryString.concat(
        placeholder,
        `${jsonPath}['${attributeName}.input'], ${jsonPath}['${attributeName}.null']${
          index === attributeNames.length - 1 ? "" : ","
        } `
      );
    },
    beginningString
  );

  return params.concat(")");
};

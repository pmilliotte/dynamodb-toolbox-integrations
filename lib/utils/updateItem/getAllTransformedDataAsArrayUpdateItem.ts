export const getAllTransformedDataAsArrayUpdateItem = (
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
        `${jsonPath}['${attributeName}.ExpressionAttributeNameToConcat'],${jsonPath}['${attributeName}.UpdateExpressionToConcat'],${jsonPath}['${attributeName}.ExpressionAttributeValueToConcat'], ${jsonPath}['${attributeName}.null']${
          index === attributeNames.length - 1 ? "" : ","
        } `
      );
    },
    beginningString
  );

  return params.concat(")");
};

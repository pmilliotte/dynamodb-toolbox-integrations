export const getAllTransformedDataAsArray = (
  jsonPath: string = "$",
  removePlaceholder: boolean = false
): string => {
  const beginningString = "States.Array(";

  const placeholder = removePlaceholder
    ? ""
    : `${jsonPath}['placeholderProp'], `;

  return beginningString.concat(
    placeholder,
    `${jsonPath}['inputProp'], ${jsonPath}['nullProp'])`
  );
};

export const valuesToArray = (
  attributeNames: string[],
  jsonPath: string = "$"
): string => {
  const string = "States.Array(";

  const params = attributeNames.reduce(
    (temporaryParams, attributeName, index) =>
      temporaryParams.concat(
        `${jsonPath}['${attributeName}']${
          index === attributeNames.length - 1 ? "" : ","
        }`
      ),
    string
  );

  return params.concat(")");
};

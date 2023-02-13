export const valueToObject = (
  jsonPath: string = "$"
): Record<string, unknown> => {
  return {
    "isPlaceholder.$": `States.ArrayContains(${jsonPath}.valueAsArray, $.uuid)`,
    "isNull.$": `States.ArrayContains(${jsonPath}.valueAsArray, null)`,
    "alias.$": "$.alias",
    "type.$": "$.type",
    "value.$": "$.value",
    "uuid.$": "$.uuid",
  };
};

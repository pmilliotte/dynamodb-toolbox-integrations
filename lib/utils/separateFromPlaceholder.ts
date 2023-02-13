export const separateFromPlaceholder = (
  jsonPath: string = "$",
  removePlaceholder: boolean = false
): Record<string, unknown> => ({
  ...(removePlaceholder
    ? {}
    : {
        [`placeholderProp`]: {
          // 0 or 1
          "length.$": `States.ArrayLength(${jsonPath}[?(@.isPlaceholder == true)])`,
          valueToConcat: "",
          separator: "",
          "uuid.$": "$.uuid",
        },
      }),
  nullProp: {
    // 0 or 1
    "length.$": `States.ArrayLength(${jsonPath}[?(@.isNull == true)])`,
    "valueToConcat.$": `States.Format('\"{}\": null, ', ${jsonPath}.alias)`,
    separator: ",",
    "uuid.$": "$.uuid",
  },
  [`inputProp`]: {
    // 0 or 1
    "length.$": `States.ArrayLength(${jsonPath}[?(@.isPlaceholder == false && @.isNull == false)])`,

    "valueToConcat.$": `States.Format('\"{}\": {}', $.alias, States.JsonToString($.value))`,
    separator: ",",
    "uuid.$": "$.uuid",
  },
  "alias.$": "$.alias",
});

import { Entity } from "../../types";
import { getAttributeMaps } from "../attributes";

export const concatMapsUpdateItem = (
  entity: Entity,
  jsonPath: string,
  separatorPath: string,
  startString: string = "{",
  endString: string = "}"
): string => {
  const maps = getAttributeMaps(entity);

  const format = maps.reduce(
    ({ currentPlaceholdersString, currentValuesString }, attributeName) => {
      if (
        attributeName === entity.sortKey ||
        attributeName === entity.partitionKey
      )
        return { currentPlaceholdersString, currentValuesString };

      if (attributeName === "_md")
        return {
          currentPlaceholdersString: currentPlaceholdersString.concat("{} "),
          currentValuesString: `, ${jsonPath}['${attributeName}']`.concat(
            currentValuesString
          ),
        };

      return {
        currentPlaceholdersString: currentPlaceholdersString.concat("{} {} "),
        currentValuesString: currentValuesString.concat(
          `, ${separatorPath}['${attributeName}'], ${jsonPath}['${attributeName}']`
        ),
      };
    },
    {
      currentPlaceholdersString: "",
      currentValuesString: "",
    }
  );

  return "States.Format('{} "
    .concat(format.currentPlaceholdersString)
    .concat(`{}', '${startString}'`)
    .concat(format.currentValuesString)
    .concat(`, '${endString}')`);
};

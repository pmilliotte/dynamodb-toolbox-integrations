import { Entity } from "../types";
import { getAttributeMaps } from "./attributes";

export const getAllTransformedDataAsArray = (entity: Entity): string => {
  const string = "States.Array(";

  const attributeMaps = getAttributeMaps(entity);

  const params = attributeMaps.reduce(
    (temporaryString, attributeMap, index) =>
      temporaryString.concat(
        `$.arrays['${attributeMap}.placeholder'], $.arrays['${attributeMap}.input'], $.arrays['${attributeMap}.null']${
          index === attributeMaps.length - 1 ? "" : ","
        } `
      ),
    string
  );

  return params.concat(")");
};

import { Entity } from "../types";
import { getAttributeMaps } from "./attributes";

export const getDataAsArray = (entity: Entity): string => {
  const string = "States.Array(";

  const attributeMaps = getAttributeMaps(entity);

  const params = attributeMaps.reduce(
    (temporaryParams, attributeMap, index) =>
      temporaryParams.concat(
        `$.data['${attributeMap}']${
          index === attributeMaps.length - 1 ? "" : ","
        }`
      ),
    string
  );

  return params.concat(")");
};

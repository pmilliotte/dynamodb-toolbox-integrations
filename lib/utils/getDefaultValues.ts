import { Entity } from "../types";
import { getAttributeAliases } from "./attributes";

const dateDefaultValues = {
  default: "$$.State.EnteredTime",
  isJsonPath: true,
};

const getOverridenAttributes = (entity: Entity) => ({
  ...entity.schema.attributes,
  [entity.createdAlias]: {
    ...entity.schema.attributes[entity.createdAlias],
    ...dateDefaultValues,
  },
  [entity.modifiedAlias]: {
    ...entity.schema.attributes[entity.modifiedAlias],
    ...dateDefaultValues,
  },
});

export const getDefaultValues = (entity: Entity): Record<string, string> => {
  const attributes = getOverridenAttributes(entity);

  const params = getAttributeAliases(entity).reduce(
    (temporaryParams, alias) => {
      const defaultValue = attributes[alias].default;

      if (typeof defaultValue === "function") {
        throw new Error("Functions default values are not supported yet");
      }

      if (defaultValue === undefined) {
        return temporaryParams;
      }

      return {
        ...temporaryParams,
        [`${alias}${attributes[alias].isJsonPath === true ? ".$" : ""}`]:
          defaultValue,
      };
    },
    {}
  );

  return params;
};

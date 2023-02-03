import { Entity } from "../../types";
import { getAttributeAliases } from "../attributes";

const dateDefaultValues = {
  default: "$$.State.EnteredTime",
  isJsonPath: true,
};

const getOverridenAttributesUpdateItem = (entity: Entity) => ({
  ...entity.schema.attributes,
  [entity.modifiedAlias]: {
    ...entity.schema.attributes[entity.modifiedAlias],
    ...dateDefaultValues,
  },
});

export const getDefaultValuesUpdateItem = (
  entity: Entity
): Record<string, string> => {
  const attributes = getOverridenAttributesUpdateItem(entity);

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

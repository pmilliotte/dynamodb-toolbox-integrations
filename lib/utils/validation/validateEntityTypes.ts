import { Entity, SUPPORTED_ATTRIBUTE_TYPES } from "../../types";
import { getAttributeAliases } from "../attributes";

export const validateEntityTypes = (entity: Entity) => {
  if (
    getAttributeAliases(entity).find(
      (alias) =>
        !SUPPORTED_ATTRIBUTE_TYPES.includes(
          entity.schema.attributes[alias].type
        )
    )
  ) {
    throw new Error(`Entity ${entity.name} has unsupported types`);
  }
};

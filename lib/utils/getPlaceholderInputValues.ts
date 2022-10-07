import { Entity } from "../types";
import {
  DYNAMODB_TOOLBOX_GENERATED_ATTRIBUTE_ALIASES,
  LIB_GENERATED_ATTRIBUTE_ALIASES,
} from "./constants";

export const getPlaceholderInputValues = (
  entity: Entity
): Record<string, string> => {
  const { attributes } = entity.schema;

  const params = Object.keys(
    entity.attributes as Record<string, unknown>
  ).reduce((temporaryParams, attributeKey) => {
    const attributeAlias = attributes[attributeKey].alias ?? attributeKey;

    if (DYNAMODB_TOOLBOX_GENERATED_ATTRIBUTE_ALIASES.includes(attributeAlias)) {
      return {
        ...temporaryParams,
        [`${attributeAlias}`]: "placeholder",
      };
    }

    if (LIB_GENERATED_ATTRIBUTE_ALIASES.includes(attributeAlias)) {
      return {
        ...temporaryParams,
        [`${attributeAlias}.$`]: "States.UUID()",
      };
    }

    return {
      ...temporaryParams,
      [`${attributeAlias}.$`]: "$.uuid",
    };
  }, {});

  return params;
};

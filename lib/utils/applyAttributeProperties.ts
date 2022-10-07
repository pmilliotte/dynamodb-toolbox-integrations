import { Entity } from "../types";
import {
  DYNAMODB_TOOLBOX_GENERATED_ATTRIBUTE_ALIASES,
  LIB_GENERATED_ATTRIBUTE_ALIASES,
} from "./constants";

const TYPE_MAPPING: Record<string, string> = {
  string: "S",
  number: "N",
  boolean: "Bool",
  map: "M",
};

export const applyAttributeProperties = (
  entity: Entity
): Record<string, unknown> => {
  const { attributes } = entity.schema;

  const nullValue = entity.table.removeNullAttributes
    ? null
    : {
        NULL: true,
      };

  const params = Object.entries(
    entity.attributes as Record<
      string,
      { type: string; prefix: string; suffix: string }
    >
  ).reduce((tempParams, [attributeKey, { type, prefix, suffix }]) => {
    const attributeMap = attributes[attributeKey].map ?? attributeKey;
    const attributeAlias = attributes[attributeKey].alias ?? attributeKey;

    if (DYNAMODB_TOOLBOX_GENERATED_ATTRIBUTE_ALIASES.includes(attributeAlias)) {
      return {
        ...tempParams,
        [attributeMap]: {
          value: [{ "S.$": `$$.State.EnteredTime` }],
          isPlaceholder: false,
          // Won't be selected anyway
          nullValue: [null],
          attributeMap,
          isNull: false,
        },
      };
    }

    const key = `${TYPE_MAPPING[type]}.$`;
    const value = {
      [key]: `States.Format('${prefix ?? ""}{}${
        suffix ?? ""
      }', $.data.${attributeMap}[0])`,
    };

    return {
      ...tempParams,
      [attributeMap]: {
        value: [value],
        "isPlaceholder.$": `States.ArrayContains($.data['${attributeMap}'], $.uuid)`,
        "isNull.$": `States.ArrayContains($.data['${attributeMap}'], null)`,
        // Need to set it as array to be able to get null value if removeNullAttributes is true, because Dynamodb does not support Null properties set to false
        nullValue: [null],
        null2Value: [nullValue],
        attributeMap,
      },
    };
  }, {} as Record<string, unknown>);

  return params;
};

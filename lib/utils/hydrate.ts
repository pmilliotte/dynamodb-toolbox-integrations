import { Entity, TYPE_MAPPING } from "../types";

export const hydrate = (
  maps: string[],
  entity: Entity,
  jsonPath: string
): Record<string, string | null>[] =>
  maps.map((map) => {
    const { type, alias } = entity.schema.attributes[map];

    return {
      "valueAsArray.$": `States.Array(${jsonPath}['${map}'].${TYPE_MAPPING[type]})`,
      "value.$": `${jsonPath}['${map}'].${TYPE_MAPPING[type]}`,
      nullValue: null,
      null2Value: null,
      "uuid.$": "$.uuid",
      alias: alias ?? map,
      type,
    };
  });

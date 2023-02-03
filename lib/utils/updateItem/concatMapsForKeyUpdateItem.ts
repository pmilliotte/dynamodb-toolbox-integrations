import { Entity } from "../../types";
import { getAttributeMaps } from "../attributes";

export const concatMapsForKeyUpdateItem = (
  entity: Entity,
  jsonPath: string
): string =>
  `States.Format('{} {}, {} {}', '{',${jsonPath}['${entity.partitionKey.toString()}'], ${jsonPath}['${entity.sortKey.toString()}'], '}')`;

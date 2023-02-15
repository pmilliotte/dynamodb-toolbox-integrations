import { TYPE_MAPPING } from "../types";
import Entity, {
  AttributeDefinitions,
  Overlay,
  ParsedAttributes,
} from "dynamodb-toolbox/dist/classes/Entity";
import { TableDef } from "dynamodb-toolbox/dist/classes/Table";
import { PreventKeys } from "dynamodb-toolbox/dist/lib/utils";
import type { O } from "ts-toolbelt";

export const hydrate = <
  EntityTable extends TableDef,
  EntityItemOverlay extends Overlay,
  EntityCompositeKeyOverlay extends Overlay,
  Name extends string,
  AutoExecute extends boolean,
  AutoParse extends boolean,
  Timestamps extends boolean,
  CreatedAlias extends string,
  ModifiedAlias extends string,
  TypeAlias extends string,
  ReadonlyAttributeDefinitions extends PreventKeys<
    AttributeDefinitions | Readonly<AttributeDefinitions>,
    CreatedAlias | ModifiedAlias | TypeAlias
  >,
  WritableAttributeDefinitions extends AttributeDefinitions,
  Attributes extends ParsedAttributes,
  $Item extends any,
  Item extends O.Object,
  CompositePrimaryKey extends O.Object
>(
  maps: string[],
  entity: Entity<
    EntityItemOverlay,
    EntityCompositeKeyOverlay,
    EntityTable,
    Name,
    AutoExecute,
    AutoParse,
    Timestamps,
    CreatedAlias,
    ModifiedAlias,
    TypeAlias,
    ReadonlyAttributeDefinitions,
    WritableAttributeDefinitions,
    Attributes,
    $Item,
    Item,
    CompositePrimaryKey
  >,
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

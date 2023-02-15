
import { TYPE_MAPPING } from "../types/Entity";
import Entity, {
  AttributeDefinitions,
  Overlay,
  ParsedAttributes,
} from "dynamodb-toolbox/dist/classes/Entity";
import { TableDef } from "dynamodb-toolbox/dist/classes/Table";
import { PreventKeys } from "dynamodb-toolbox/dist/lib/utils";
import type { O } from "ts-toolbelt";

export const getPlaceholderValuesWithType = <
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
  attributes: string[],
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
>
): Record<string, string> => {
  const params = attributes.reduce((temporaryParams, attributeName) => {
    const { type } = entity.schema.attributes[attributeName];
    const key = `${TYPE_MAPPING[type]}.$`;

    return {
      ...temporaryParams,
      [`${attributeName}`]: { [key]: "$.uuid" },
    };
  }, {});

  return params;
};

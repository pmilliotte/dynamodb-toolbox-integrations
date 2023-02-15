import { getAttributeAliases } from "./attributes";
import Entity, {
  AttributeDefinitions,
  Overlay,
  ParsedAttributes,
} from "dynamodb-toolbox/dist/classes/Entity";
import { TableDef } from "dynamodb-toolbox/dist/classes/Table";
import { PreventKeys } from "dynamodb-toolbox/dist/lib/utils";
import type { O } from "ts-toolbelt";

const dateDefaultValues = {
  default: "$$.State.EnteredTime",
  isJsonPath: true,
};

const getOverridenAttributes = <
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
) => ({
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

export const getDefaultValues = <
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

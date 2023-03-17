import intersection from "lodash/intersection";
import uniq from "lodash/uniq";
import Entity, {
  AttributeDefinitions,
  Overlay,
  ParsedAttributes,
} from "dynamodb-toolbox/dist/classes/Entity";
import { TableDef } from "dynamodb-toolbox/dist/classes/Table";
import { PreventKeys } from "dynamodb-toolbox/dist/lib/utils";
import type { O } from "ts-toolbelt";

export const getAttributeMaps = <
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
): string[] =>
  uniq(
    Object.keys(entity.schema.attributes).map(
      (attributeKey) =>
        entity.schema.attributes[attributeKey].map ?? attributeKey
    )
  );

export const getAttributeAliases = <
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
): string[] =>
  uniq(
    Object.keys(entity.schema.attributes).map(
      (attributeKey) =>
        entity.schema.attributes[attributeKey].alias ?? attributeKey
    )
  );

export const getKeyAliases = <
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
): string[] => {
  const partitionAndSortAttributeKeys = Object.keys(
    entity.schema.attributes
  ).filter(
    (attributeKey) =>
      !!entity.schema.attributes[attributeKey].partitionKey ||
      !!entity.schema.attributes[attributeKey].sortKey
  );
  const uniquePartitionAndSortAttributeKeysAliases = uniq(
    partitionAndSortAttributeKeys.map(
      (attributeKey) =>
        entity.schema.attributes[attributeKey].alias ?? attributeKey
    )
  );

  return uniquePartitionAndSortAttributeKeysAliases;
};

export const getPartitionKeyAlias = <
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
) => {
  const attributeKey = Object.keys(entity.schema.attributes).find(
    (attributeKey) => !!entity.schema.attributes[attributeKey].partitionKey
  );

  if (attributeKey === undefined) {
    throw new Error("Entity must have a partition key");
  }

  return entity.schema.attributes[attributeKey].alias ?? attributeKey;
};

export const aliasToMap = <
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
  >,
  inputAliases?: string[]
): string[] => {
  const entityAliases = getAttributeAliases(entity);
  const aliases = intersection(inputAliases ?? entityAliases, entityAliases);

  return uniq(
    Object.keys(entity.schema.attributes)
      .filter(
        (attributeKey) =>
          aliases?.includes(entity.schema.attributes[attributeKey].alias) ||
          aliases?.includes(attributeKey)
      )
      .map(
        (attributeKey) =>
          entity.schema.attributes[attributeKey].map ?? attributeKey
      )
  );
};

export const getExpressionProperties = <
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
  >,
  inputAliases?: string[]
) => {
  const maps = aliasToMap(entity, inputAliases);

  const partitionKey = Object.keys(entity.schema.attributes).find(
    (attributeKey) =>
      entity.schema.attributes[attributeKey].partitionKey === true
  );

  if (partitionKey === undefined) {
    return {
      ProjectionExpression: undefined,
      ExpressionAttributeNames: undefined,
    };
  }

  const PK_EXPRESSION_ATTRIBUTE_NAME = {
    "#0": entity.schema.attributes[partitionKey].map ?? partitionKey,
  };

  if (maps.length === 0) {
    return {
      ProjectionExpression: undefined,
      ExpressionAttributeNames: PK_EXPRESSION_ATTRIBUTE_NAME,
    };
  }
  return maps.reduce(
    (acc, map, index) => {
      const separator = acc.ProjectionExpression === "" ? "" : ", ";
      return {
        ProjectionExpression: acc.ProjectionExpression.concat(
          `${separator}#${index + 1}`
        ),
        ExpressionAttributeNames: {
          ...acc.ExpressionAttributeNames,
          [`#${index + 1}`]: map,
        },
      };
    },
    {
      ProjectionExpression: "",
      ExpressionAttributeNames: PK_EXPRESSION_ATTRIBUTE_NAME,
    }
  );
};

import { Entity as DynamodbToolboxEntity } from "dynamodb-toolbox";
import { TableDef } from "dynamodb-toolbox/dist/classes/Table";

export type Entity = DynamodbToolboxEntity<undefined, undefined, TableDef>;

export type EntityAttributes = Record<
  string,
  { type: string; prefix: string; suffix: string }
>;

export const TYPE_MAPPING: Record<string, string> = {
  string: "S",
  number: "N",
  boolean: "Bool",
  map: "M",
};

import { Entity as DynamodbToolboxEntity } from "dynamodb-toolbox";
import { TableDef } from "dynamodb-toolbox/dist/classes/Table";

export type Entity = DynamodbToolboxEntity<undefined, undefined, TableDef>;

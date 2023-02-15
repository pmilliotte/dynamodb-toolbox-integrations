export type EntityAttributes = Record<
  string,
  { type: string; prefix: string; suffix: string }
>;

export const SUPPORTED_ATTRIBUTE_TYPES = [
  "string",
  "number",
  "boolean",
] as const;

export const DYNAMODB_TYPES = ["string", "number", "boolean", "map"] as const;

export type DynamodbType = typeof DYNAMODB_TYPES[number];

export const TYPE_MAPPING: Record<string, string> = {
  string: "S",
  number: "N",
  boolean: "BOOL",
  map: "M",
};

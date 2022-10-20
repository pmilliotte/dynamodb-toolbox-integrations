import { Entity } from "dynamodb-toolbox";
export declare const TestEntity: Entity<undefined, undefined, import("dynamodb-toolbox/dist/classes/Table/Table").default<"Test", "type", "id">, "Test", true, true, true, "created", "modified", "entity", {
    type: {
        partitionKey: true;
        type: "string";
    };
    id: {
        sortKey: true;
        type: "string";
    };
}, import("dynamodb-toolbox/dist/classes/Entity").Writable<{
    type: {
        partitionKey: true;
        type: "string";
    };
    id: {
        sortKey: true;
        type: "string";
    };
}>, import("dynamodb-toolbox/dist/classes/Entity").ParseAttributes<import("dynamodb-toolbox/dist/classes/Entity").Writable<{
    type: {
        partitionKey: true;
        type: "string";
    };
    id: {
        sortKey: true;
        type: "string";
    };
}>, true, "created", "modified", "entity", "created" | "modified" | "entity", "created" | "modified" | "entity", "type", never, never, "id", never, never, "type" | "id", "modified", "created" | "entity", "created" | "modified" | "entity" | "type" | "id", never>, {
    created: string;
    modified: string;
    entity: string;
    type: string;
    id: string;
}, {
    created: string;
    modified: string;
    entity: string;
    type: string;
    id: string;
}, {
    type: string;
    id: string;
}>;

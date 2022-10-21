"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestEntity = void 0;
const dynamodb_toolbox_1 = require("dynamodb-toolbox");
const table_1 = require("./table");
exports.TestEntity = new dynamodb_toolbox_1.Entity({
    name: "Test",
    attributes: {
        type: {
            partitionKey: true,
            type: "string",
        },
        id: { sortKey: true, type: "string" },
    },
    table: table_1.TestTable,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZW50aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVEQUEwQztBQUMxQyxtQ0FBb0M7QUFFdkIsUUFBQSxVQUFVLEdBQUcsSUFBSSx5QkFBTSxDQUFDO0lBQ25DLElBQUksRUFBRSxNQUFNO0lBQ1osVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFO1lBQ0osWUFBWSxFQUFFLElBQUk7WUFDbEIsSUFBSSxFQUFFLFFBQVE7U0FDZjtRQUNELEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtLQUN0QztJQUNELEtBQUssRUFBRSxpQkFBUztDQUNqQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbnRpdHkgfSBmcm9tIFwiZHluYW1vZGItdG9vbGJveFwiO1xuaW1wb3J0IHsgVGVzdFRhYmxlIH0gZnJvbSBcIi4vdGFibGVcIjtcblxuZXhwb3J0IGNvbnN0IFRlc3RFbnRpdHkgPSBuZXcgRW50aXR5KHtcbiAgbmFtZTogXCJUZXN0XCIsXG4gIGF0dHJpYnV0ZXM6IHtcbiAgICB0eXBlOiB7XG4gICAgICBwYXJ0aXRpb25LZXk6IHRydWUsXG4gICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgIH0sXG4gICAgaWQ6IHsgc29ydEtleTogdHJ1ZSwgdHlwZTogXCJzdHJpbmdcIiB9LFxuICB9LFxuICB0YWJsZTogVGVzdFRhYmxlLFxufSk7XG4iXX0=
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const dynamodb_1 = require("aws-sdk/clients/dynamodb");
const dynamodb_toolbox_1 = require("dynamodb-toolbox");
const documentClient = new dynamodb_1.DocumentClient({ region: "eu-west-1" });
exports.main = async (payload) => {
    const TestUpdateTable = new dynamodb_toolbox_1.Table({
        name: process.env.tableName,
        partitionKey: "pk",
        sortKey: "sk",
        DocumentClient: documentClient,
    });
    const TestUpdateEntity = new dynamodb_toolbox_1.Entity({
        name: "Update",
        attributes: {
            pk: {
                partitionKey: true,
                type: "string",
            },
            sk: { sortKey: true, type: "string" },
            requiredNumber: { type: "number" },
            requiredString: { type: "string" },
            optionalString: { type: "string" },
        },
        table: TestUpdateTable,
    });
    // @ts-expect-error
    await TestUpdateEntity.update(payload);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvVXRpbHMvVXBkYXRlSXRlbUR5bmFtb2RiVG9vbGJveC9oYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVEQUEwRDtBQUMxRCx1REFBaUQ7QUFDakQsTUFBTSxjQUFjLEdBQUcsSUFBSSx5QkFBYyxDQUFDLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7QUFDdEQsUUFBQSxJQUFJLEdBQUcsS0FBSyxFQUFFLE9BQWdDLEVBQWlCLEVBQUU7SUFDNUUsTUFBTSxlQUFlLEdBQUcsSUFBSSx3QkFBSyxDQUFDO1FBQ2hDLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQW1CO1FBQ3JDLFlBQVksRUFBRSxJQUFJO1FBQ2xCLE9BQU8sRUFBRSxJQUFJO1FBQ2IsY0FBYyxFQUFFLGNBQWM7S0FFL0IsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLHlCQUFNLENBQUM7UUFDbEMsSUFBSSxFQUFFLFFBQVE7UUFDZCxVQUFVLEVBQUU7WUFDVixFQUFFLEVBQUU7Z0JBQ0YsWUFBWSxFQUFFLElBQUk7Z0JBQ2xCLElBQUksRUFBRSxRQUFRO2FBQ2Y7WUFDRCxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDckMsY0FBYyxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUNsQyxjQUFjLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQ2xDLGNBQWMsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7U0FDbkM7UUFDRCxLQUFLLEVBQUUsZUFBZTtLQUN2QixDQUFDLENBQUM7SUFDSCxtQkFBbUI7SUFDbkIsTUFBTSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDekMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRG9jdW1lbnRDbGllbnQgfSBmcm9tIFwiYXdzLXNkay9jbGllbnRzL2R5bmFtb2RiXCI7XG5pbXBvcnQgeyBFbnRpdHksIFRhYmxlIH0gZnJvbSBcImR5bmFtb2RiLXRvb2xib3hcIjtcbmNvbnN0IGRvY3VtZW50Q2xpZW50ID0gbmV3IERvY3VtZW50Q2xpZW50KHsgcmVnaW9uOiBcImV1LXdlc3QtMVwiIH0pO1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAocGF5bG9hZDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgY29uc3QgVGVzdFVwZGF0ZVRhYmxlID0gbmV3IFRhYmxlKHtcbiAgICBuYW1lOiBwcm9jZXNzLmVudi50YWJsZU5hbWUgYXMgc3RyaW5nLFxuICAgIHBhcnRpdGlvbktleTogXCJwa1wiLFxuICAgIHNvcnRLZXk6IFwic2tcIixcbiAgICBEb2N1bWVudENsaWVudDogZG9jdW1lbnRDbGllbnQsXG4gICAgLy8gcmVtb3ZlTnVsbEF0dHJpYnV0ZXM6IGZhbHNlLFxuICB9KTtcbiAgY29uc3QgVGVzdFVwZGF0ZUVudGl0eSA9IG5ldyBFbnRpdHkoe1xuICAgIG5hbWU6IFwiVXBkYXRlXCIsXG4gICAgYXR0cmlidXRlczoge1xuICAgICAgcGs6IHtcbiAgICAgICAgcGFydGl0aW9uS2V5OiB0cnVlLFxuICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgfSxcbiAgICAgIHNrOiB7IHNvcnRLZXk6IHRydWUsIHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgIHJlcXVpcmVkTnVtYmVyOiB7IHR5cGU6IFwibnVtYmVyXCIgfSxcbiAgICAgIHJlcXVpcmVkU3RyaW5nOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgIG9wdGlvbmFsU3RyaW5nOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICB9LFxuICAgIHRhYmxlOiBUZXN0VXBkYXRlVGFibGUsXG4gIH0pO1xuICAvLyBAdHMtZXhwZWN0LWVycm9yXG4gIGF3YWl0IFRlc3RVcGRhdGVFbnRpdHkudXBkYXRlKHBheWxvYWQpO1xufTtcbiJdfQ==
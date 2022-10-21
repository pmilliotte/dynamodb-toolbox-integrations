"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamodbToolboxGetItem = void 0;
const aws_stepfunctions_1 = require("aws-cdk-lib/aws-stepfunctions");
const constructs_1 = require("constructs");
const applyKeyAttributes_1 = require("../utils/getItem/applyKeyAttributes");
const applyKeyAttributesForUser_1 = require("../utils/getItem/applyKeyAttributesForUser");
class DynamodbToolboxGetItem extends constructs_1.Construct {
    constructor(scope, id, { entity }) {
        super(scope, id);
        const stateJson = {
            Type: "Task",
            Resource: "arn:aws:states:::dynamodb:getItem",
            Parameters: {
                TableName: entity.table.name,
                Key: applyKeyAttributes_1.applyKeyAttributeProperties(entity),
            },
            ResultSelector: {
                Item: applyKeyAttributesForUser_1.applyKeyAttributePropertiesForUser(entity),
            },
            ResultPath: null,
        };
        const getItemTask = new aws_stepfunctions_1.CustomState(this, "GetItemTask", {
            stateJson,
        });
        this.task = getItemTask;
    }
}
exports.DynamodbToolboxGetItem = DynamodbToolboxGetItem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRHluYW1vZGJUb29sYm94R2V0SXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkR5bmFtb2RiVG9vbGJveEdldEl0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUVBQXlFO0FBQ3pFLDJDQUF1QztBQUV2Qyw0RUFBa0Y7QUFDbEYsMEZBQWdHO0FBRWhHLE1BQWEsc0JBQXVCLFNBQVEsc0JBQVM7SUFHbkQsWUFDRSxLQUFnQixFQUNoQixFQUFVLEVBQ1YsRUFBRSxNQUFNLEVBQTRDO1FBRXBELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxTQUFTLEdBQUc7WUFDaEIsSUFBSSxFQUFFLE1BQU07WUFDWixRQUFRLEVBQUUsbUNBQW1DO1lBQzdDLFVBQVUsRUFBRTtnQkFDVixTQUFTLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJO2dCQUM1QixHQUFHLEVBQUUsZ0RBQTJCLENBQUMsTUFBTSxDQUFDO2FBQ3pDO1lBQ0QsY0FBYyxFQUFFO2dCQUNkLElBQUksRUFBRSw4REFBa0MsQ0FBQyxNQUFNLENBQUM7YUFDakQ7WUFDRCxVQUFVLEVBQUUsSUFBSTtTQUNqQixDQUFDO1FBQ0YsTUFBTSxXQUFXLEdBQUcsSUFBSSwrQkFBVyxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDdkQsU0FBUztTQUNWLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDO0lBQzFCLENBQUM7Q0FDRjtBQTVCRCx3REE0QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFpbiwgQ3VzdG9tU3RhdGUsIFBhc3MgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLXN0ZXBmdW5jdGlvbnNcIjtcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJjb25zdHJ1Y3RzXCI7XG5pbXBvcnQgeyBEeW5hbW9kYlRvb2xib3hJbnRlZ3JhdGlvbkNvbnN0cnVjdFByb3BzIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5pbXBvcnQgeyBhcHBseUtleUF0dHJpYnV0ZVByb3BlcnRpZXMgfSBmcm9tIFwiLi4vdXRpbHMvZ2V0SXRlbS9hcHBseUtleUF0dHJpYnV0ZXNcIjtcbmltcG9ydCB7IGFwcGx5S2V5QXR0cmlidXRlUHJvcGVydGllc0ZvclVzZXIgfSBmcm9tIFwiLi4vdXRpbHMvZ2V0SXRlbS9hcHBseUtleUF0dHJpYnV0ZXNGb3JVc2VyXCI7XG5cbmV4cG9ydCBjbGFzcyBEeW5hbW9kYlRvb2xib3hHZXRJdGVtIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgcHVibGljIHRhc2s6IEN1c3RvbVN0YXRlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHNjb3BlOiBDb25zdHJ1Y3QsXG4gICAgaWQ6IHN0cmluZyxcbiAgICB7IGVudGl0eSB9OiBEeW5hbW9kYlRvb2xib3hJbnRlZ3JhdGlvbkNvbnN0cnVjdFByb3BzXG4gICkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBzdGF0ZUpzb24gPSB7XG4gICAgICBUeXBlOiBcIlRhc2tcIixcbiAgICAgIFJlc291cmNlOiBcImFybjphd3M6c3RhdGVzOjo6ZHluYW1vZGI6Z2V0SXRlbVwiLFxuICAgICAgUGFyYW1ldGVyczoge1xuICAgICAgICBUYWJsZU5hbWU6IGVudGl0eS50YWJsZS5uYW1lLFxuICAgICAgICBLZXk6IGFwcGx5S2V5QXR0cmlidXRlUHJvcGVydGllcyhlbnRpdHkpLFxuICAgICAgfSxcbiAgICAgIFJlc3VsdFNlbGVjdG9yOiB7XG4gICAgICAgIEl0ZW06IGFwcGx5S2V5QXR0cmlidXRlUHJvcGVydGllc0ZvclVzZXIoZW50aXR5KSxcbiAgICAgIH0sXG4gICAgICBSZXN1bHRQYXRoOiBudWxsLFxuICAgIH07XG4gICAgY29uc3QgZ2V0SXRlbVRhc2sgPSBuZXcgQ3VzdG9tU3RhdGUodGhpcywgXCJHZXRJdGVtVGFza1wiLCB7XG4gICAgICBzdGF0ZUpzb24sXG4gICAgfSk7XG5cbiAgICB0aGlzLnRhc2sgPSBnZXRJdGVtVGFzaztcbiAgfVxufVxuIl19
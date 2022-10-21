"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamodbToolboxPutItem = void 0;
const aws_stepfunctions_1 = require("aws-cdk-lib/aws-stepfunctions");
const constructs_1 = require("constructs");
const applyAttributeProperties_1 = require("../utils/applyAttributeProperties");
const getAllTransformedDataAsArray_1 = require("../utils/getAllTransformedDataAsArray");
const getDataAsArray_1 = require("../utils/getDataAsArray");
const getFirstItem_1 = require("../utils/getFirstItem");
const getPlaceholderInputValues_1 = require("../utils/getPlaceholderInputValues");
const keepRelevantValue_1 = require("../utils/keepRelevantValue");
const mapToArray_1 = require("../utils/mapToArray");
const separateFromPlaceholder_1 = require("../utils/separateFromPlaceholder");
class DynamodbToolboxPutItem extends constructs_1.Construct {
    constructor(scope, id, { entity }) {
        super(scope, id);
        const generateUuid = new aws_stepfunctions_1.Pass(this, "GenerateUuidTask", {
            parameters: {
                // To be changed with inputPath
                "input.$": "$",
                "uuid.$": "States.UUID()",
            },
        });
        const getNullInputValuesTask = new aws_stepfunctions_1.Pass(this, "IntermediaryTask", {
            parameters: {
                "input.$": "$.input",
                "uuid.$": "$.uuid",
                placeholderInputValues: getPlaceholderInputValues_1.getPlaceholderInputValues(entity),
            },
        });
        const mergeInputTask = new aws_stepfunctions_1.Pass(this, "MergeInputTask", {
            parameters: {
                "uuid.$": "$.uuid",
                "data.$": "States.JsonMerge($.placeholderInputValues, $.input, false)",
            },
        });
        const mapToArrayTask = new aws_stepfunctions_1.Pass(this, "MapToArrayTask", {
            parameters: {
                "uuid.$": "$.uuid",
                data: mapToArray_1.mapToArray(entity),
            },
        });
        const applyAttributePropertiesTask = new aws_stepfunctions_1.Pass(this, "ApplyAttributePropertiesTask", {
            parameters: {
                "uuid.$": "$.uuid",
                data: applyAttributeProperties_1.applyAttributeProperties(entity),
            },
        });
        const getDataAsArrayTask = new aws_stepfunctions_1.Pass(this, "GetDataAsArrayTask", {
            parameters: {
                "uuid.$": "$.uuid",
                "array.$": getDataAsArray_1.getDataAsArray(entity),
            },
        });
        const separateFromPlaceholderTask = new aws_stepfunctions_1.Pass(this, "SeparateFromPlaceholderTask", {
            parameters: {
                "uuid.$": "$.uuid",
                arrays: separateFromPlaceholder_1.separateFromPlaceholder(entity),
            },
        });
        const getAllTransformedDataAsArrayTask = new aws_stepfunctions_1.Pass(this, "GetAllTransformedDataAsArrayTask", {
            parameters: {
                "uuid.$": "$.uuid",
                "arrays.$": getAllTransformedDataAsArray_1.getAllTransformedDataAsArray(entity),
            },
        });
        const keepRelevantValueTask = new aws_stepfunctions_1.Pass(this, "KeepRelevantValueTask", {
            parameters: {
                object: keepRelevantValue_1.keepRelevantValue(entity),
            },
        });
        const getFirstItemTask = new aws_stepfunctions_1.Pass(this, "GetFirstItemTask", {
            parameters: {
                object: getFirstItem_1.getFirstItem(entity),
            },
        });
        const putItemTask = new aws_stepfunctions_1.CustomState(this, "PutItemTask", {
            stateJson: {
                Type: "Task",
                Resource: "arn:aws:states:::dynamodb:putItem",
                Parameters: {
                    TableName: entity.table.name,
                    "Item.$": "$.object",
                },
                ResultPath: null,
            },
        });
        this.chain = generateUuid
            .next(getNullInputValuesTask)
            .next(mergeInputTask)
            .next(mapToArrayTask)
            .next(applyAttributePropertiesTask)
            .next(getDataAsArrayTask)
            .next(separateFromPlaceholderTask)
            .next(getAllTransformedDataAsArrayTask)
            .next(keepRelevantValueTask)
            .next(getFirstItemTask)
            .next(putItemTask);
    }
}
exports.DynamodbToolboxPutItem = DynamodbToolboxPutItem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRHluYW1vZGJUb29sYm94UHV0SXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkR5bmFtb2RiVG9vbGJveFB1dEl0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUVBQXlFO0FBQ3pFLDJDQUF1QztBQUV2QyxnRkFBNkU7QUFFN0Usd0ZBQXFGO0FBQ3JGLDREQUF5RDtBQUN6RCx3REFBcUQ7QUFDckQsa0ZBQStFO0FBQy9FLGtFQUErRDtBQUMvRCxvREFBaUQ7QUFDakQsOEVBQTJFO0FBRTNFLE1BQWEsc0JBQXVCLFNBQVEsc0JBQVM7SUFHbkQsWUFDRSxLQUFnQixFQUNoQixFQUFVLEVBQ1YsRUFBRSxNQUFNLEVBQTRDO1FBRXBELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxZQUFZLEdBQUcsSUFBSSx3QkFBSSxDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRTtZQUN0RCxVQUFVLEVBQUU7Z0JBQ1YsK0JBQStCO2dCQUMvQixTQUFTLEVBQUUsR0FBRztnQkFDZCxRQUFRLEVBQUUsZUFBZTthQUMxQjtTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sc0JBQXNCLEdBQUcsSUFBSSx3QkFBSSxDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRTtZQUNoRSxVQUFVLEVBQUU7Z0JBQ1YsU0FBUyxFQUFFLFNBQVM7Z0JBQ3BCLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixzQkFBc0IsRUFBRSxxREFBeUIsQ0FBQyxNQUFNLENBQUM7YUFDMUQ7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLGNBQWMsR0FBRyxJQUFJLHdCQUFJLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQ3RELFVBQVUsRUFBRTtnQkFDVixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsUUFBUSxFQUFFLDREQUE0RDthQUN2RTtTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sY0FBYyxHQUFHLElBQUksd0JBQUksQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDdEQsVUFBVSxFQUFFO2dCQUNWLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixJQUFJLEVBQUUsdUJBQVUsQ0FBQyxNQUFNLENBQUM7YUFDekI7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLDRCQUE0QixHQUFHLElBQUksd0JBQUksQ0FDM0MsSUFBSSxFQUNKLDhCQUE4QixFQUM5QjtZQUNFLFVBQVUsRUFBRTtnQkFDVixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsSUFBSSxFQUFFLG1EQUF3QixDQUFDLE1BQU0sQ0FBQzthQUN2QztTQUNGLENBQ0YsQ0FBQztRQUVGLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSx3QkFBSSxDQUFDLElBQUksRUFBRSxvQkFBb0IsRUFBRTtZQUM5RCxVQUFVLEVBQUU7Z0JBQ1YsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFNBQVMsRUFBRSwrQkFBYyxDQUFDLE1BQU0sQ0FBQzthQUNsQztTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sMkJBQTJCLEdBQUcsSUFBSSx3QkFBSSxDQUMxQyxJQUFJLEVBQ0osNkJBQTZCLEVBQzdCO1lBQ0UsVUFBVSxFQUFFO2dCQUNWLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixNQUFNLEVBQUUsaURBQXVCLENBQUMsTUFBTSxDQUFDO2FBQ3hDO1NBQ0YsQ0FDRixDQUFDO1FBRUYsTUFBTSxnQ0FBZ0MsR0FBRyxJQUFJLHdCQUFJLENBQy9DLElBQUksRUFDSixrQ0FBa0MsRUFDbEM7WUFDRSxVQUFVLEVBQUU7Z0JBQ1YsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFVBQVUsRUFBRSwyREFBNEIsQ0FBQyxNQUFNLENBQUM7YUFDakQ7U0FDRixDQUNGLENBQUM7UUFFRixNQUFNLHFCQUFxQixHQUFHLElBQUksd0JBQUksQ0FBQyxJQUFJLEVBQUUsdUJBQXVCLEVBQUU7WUFDcEUsVUFBVSxFQUFFO2dCQUNWLE1BQU0sRUFBRSxxQ0FBaUIsQ0FBQyxNQUFNLENBQUM7YUFDbEM7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLGdCQUFnQixHQUFHLElBQUksd0JBQUksQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7WUFDMUQsVUFBVSxFQUFFO2dCQUNWLE1BQU0sRUFBRSwyQkFBWSxDQUFDLE1BQU0sQ0FBQzthQUM3QjtTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sV0FBVyxHQUFHLElBQUksK0JBQVcsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ3ZELFNBQVMsRUFBRTtnQkFDVCxJQUFJLEVBQUUsTUFBTTtnQkFDWixRQUFRLEVBQUUsbUNBQW1DO2dCQUM3QyxVQUFVLEVBQUU7b0JBQ1YsU0FBUyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSTtvQkFDNUIsUUFBUSxFQUFFLFVBQVU7aUJBQ3JCO2dCQUNELFVBQVUsRUFBRSxJQUFJO2FBQ2pCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLEtBQUssR0FBRyxZQUFZO2FBQ3RCLElBQUksQ0FBQyxzQkFBc0IsQ0FBQzthQUM1QixJQUFJLENBQUMsY0FBYyxDQUFDO2FBQ3BCLElBQUksQ0FBQyxjQUFjLENBQUM7YUFDcEIsSUFBSSxDQUFDLDRCQUE0QixDQUFDO2FBQ2xDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQzthQUN4QixJQUFJLENBQUMsMkJBQTJCLENBQUM7YUFDakMsSUFBSSxDQUFDLGdDQUFnQyxDQUFDO2FBQ3RDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQzthQUMzQixJQUFJLENBQUMsZ0JBQWdCLENBQUM7YUFDdEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7Q0FDRjtBQXBIRCx3REFvSEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFpbiwgQ3VzdG9tU3RhdGUsIFBhc3MgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLXN0ZXBmdW5jdGlvbnNcIjtcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJjb25zdHJ1Y3RzXCI7XG5pbXBvcnQgeyBFbnRpdHkgfSBmcm9tIFwiLi4vdHlwZXNcIjtcbmltcG9ydCB7IGFwcGx5QXR0cmlidXRlUHJvcGVydGllcyB9IGZyb20gXCIuLi91dGlscy9hcHBseUF0dHJpYnV0ZVByb3BlcnRpZXNcIjtcbmltcG9ydCB7IER5bmFtb2RiVG9vbGJveEludGVncmF0aW9uQ29uc3RydWN0UHJvcHMgfSBmcm9tIFwiLi4vdXRpbHMvY29uc3RydWN0UHJvcHNcIjtcbmltcG9ydCB7IGdldEFsbFRyYW5zZm9ybWVkRGF0YUFzQXJyYXkgfSBmcm9tIFwiLi4vdXRpbHMvZ2V0QWxsVHJhbnNmb3JtZWREYXRhQXNBcnJheVwiO1xuaW1wb3J0IHsgZ2V0RGF0YUFzQXJyYXkgfSBmcm9tIFwiLi4vdXRpbHMvZ2V0RGF0YUFzQXJyYXlcIjtcbmltcG9ydCB7IGdldEZpcnN0SXRlbSB9IGZyb20gXCIuLi91dGlscy9nZXRGaXJzdEl0ZW1cIjtcbmltcG9ydCB7IGdldFBsYWNlaG9sZGVySW5wdXRWYWx1ZXMgfSBmcm9tIFwiLi4vdXRpbHMvZ2V0UGxhY2Vob2xkZXJJbnB1dFZhbHVlc1wiO1xuaW1wb3J0IHsga2VlcFJlbGV2YW50VmFsdWUgfSBmcm9tIFwiLi4vdXRpbHMva2VlcFJlbGV2YW50VmFsdWVcIjtcbmltcG9ydCB7IG1hcFRvQXJyYXkgfSBmcm9tIFwiLi4vdXRpbHMvbWFwVG9BcnJheVwiO1xuaW1wb3J0IHsgc2VwYXJhdGVGcm9tUGxhY2Vob2xkZXIgfSBmcm9tIFwiLi4vdXRpbHMvc2VwYXJhdGVGcm9tUGxhY2Vob2xkZXJcIjtcblxuZXhwb3J0IGNsYXNzIER5bmFtb2RiVG9vbGJveFB1dEl0ZW0gZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICBwdWJsaWMgY2hhaW46IENoYWluO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHNjb3BlOiBDb25zdHJ1Y3QsXG4gICAgaWQ6IHN0cmluZyxcbiAgICB7IGVudGl0eSB9OiBEeW5hbW9kYlRvb2xib3hJbnRlZ3JhdGlvbkNvbnN0cnVjdFByb3BzXG4gICkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBnZW5lcmF0ZVV1aWQgPSBuZXcgUGFzcyh0aGlzLCBcIkdlbmVyYXRlVXVpZFRhc2tcIiwge1xuICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAvLyBUbyBiZSBjaGFuZ2VkIHdpdGggaW5wdXRQYXRoXG4gICAgICAgIFwiaW5wdXQuJFwiOiBcIiRcIixcbiAgICAgICAgXCJ1dWlkLiRcIjogXCJTdGF0ZXMuVVVJRCgpXCIsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgZ2V0TnVsbElucHV0VmFsdWVzVGFzayA9IG5ldyBQYXNzKHRoaXMsIFwiSW50ZXJtZWRpYXJ5VGFza1wiLCB7XG4gICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgIFwiaW5wdXQuJFwiOiBcIiQuaW5wdXRcIixcbiAgICAgICAgXCJ1dWlkLiRcIjogXCIkLnV1aWRcIixcbiAgICAgICAgcGxhY2Vob2xkZXJJbnB1dFZhbHVlczogZ2V0UGxhY2Vob2xkZXJJbnB1dFZhbHVlcyhlbnRpdHkpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IG1lcmdlSW5wdXRUYXNrID0gbmV3IFBhc3ModGhpcywgXCJNZXJnZUlucHV0VGFza1wiLCB7XG4gICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgIFwidXVpZC4kXCI6IFwiJC51dWlkXCIsXG4gICAgICAgIFwiZGF0YS4kXCI6IFwiU3RhdGVzLkpzb25NZXJnZSgkLnBsYWNlaG9sZGVySW5wdXRWYWx1ZXMsICQuaW5wdXQsIGZhbHNlKVwiLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IG1hcFRvQXJyYXlUYXNrID0gbmV3IFBhc3ModGhpcywgXCJNYXBUb0FycmF5VGFza1wiLCB7XG4gICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgIFwidXVpZC4kXCI6IFwiJC51dWlkXCIsXG4gICAgICAgIGRhdGE6IG1hcFRvQXJyYXkoZW50aXR5KSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBhcHBseUF0dHJpYnV0ZVByb3BlcnRpZXNUYXNrID0gbmV3IFBhc3MoXG4gICAgICB0aGlzLFxuICAgICAgXCJBcHBseUF0dHJpYnV0ZVByb3BlcnRpZXNUYXNrXCIsXG4gICAgICB7XG4gICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICBcInV1aWQuJFwiOiBcIiQudXVpZFwiLFxuICAgICAgICAgIGRhdGE6IGFwcGx5QXR0cmlidXRlUHJvcGVydGllcyhlbnRpdHkpLFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICk7XG5cbiAgICBjb25zdCBnZXREYXRhQXNBcnJheVRhc2sgPSBuZXcgUGFzcyh0aGlzLCBcIkdldERhdGFBc0FycmF5VGFza1wiLCB7XG4gICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgIFwidXVpZC4kXCI6IFwiJC51dWlkXCIsXG4gICAgICAgIFwiYXJyYXkuJFwiOiBnZXREYXRhQXNBcnJheShlbnRpdHkpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHNlcGFyYXRlRnJvbVBsYWNlaG9sZGVyVGFzayA9IG5ldyBQYXNzKFxuICAgICAgdGhpcyxcbiAgICAgIFwiU2VwYXJhdGVGcm9tUGxhY2Vob2xkZXJUYXNrXCIsXG4gICAgICB7XG4gICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICBcInV1aWQuJFwiOiBcIiQudXVpZFwiLFxuICAgICAgICAgIGFycmF5czogc2VwYXJhdGVGcm9tUGxhY2Vob2xkZXIoZW50aXR5KSxcbiAgICAgICAgfSxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgY29uc3QgZ2V0QWxsVHJhbnNmb3JtZWREYXRhQXNBcnJheVRhc2sgPSBuZXcgUGFzcyhcbiAgICAgIHRoaXMsXG4gICAgICBcIkdldEFsbFRyYW5zZm9ybWVkRGF0YUFzQXJyYXlUYXNrXCIsXG4gICAgICB7XG4gICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICBcInV1aWQuJFwiOiBcIiQudXVpZFwiLFxuICAgICAgICAgIFwiYXJyYXlzLiRcIjogZ2V0QWxsVHJhbnNmb3JtZWREYXRhQXNBcnJheShlbnRpdHkpLFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICk7XG5cbiAgICBjb25zdCBrZWVwUmVsZXZhbnRWYWx1ZVRhc2sgPSBuZXcgUGFzcyh0aGlzLCBcIktlZXBSZWxldmFudFZhbHVlVGFza1wiLCB7XG4gICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgIG9iamVjdDoga2VlcFJlbGV2YW50VmFsdWUoZW50aXR5KSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBnZXRGaXJzdEl0ZW1UYXNrID0gbmV3IFBhc3ModGhpcywgXCJHZXRGaXJzdEl0ZW1UYXNrXCIsIHtcbiAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgb2JqZWN0OiBnZXRGaXJzdEl0ZW0oZW50aXR5KSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBwdXRJdGVtVGFzayA9IG5ldyBDdXN0b21TdGF0ZSh0aGlzLCBcIlB1dEl0ZW1UYXNrXCIsIHtcbiAgICAgIHN0YXRlSnNvbjoge1xuICAgICAgICBUeXBlOiBcIlRhc2tcIixcbiAgICAgICAgUmVzb3VyY2U6IFwiYXJuOmF3czpzdGF0ZXM6OjpkeW5hbW9kYjpwdXRJdGVtXCIsXG4gICAgICAgIFBhcmFtZXRlcnM6IHtcbiAgICAgICAgICBUYWJsZU5hbWU6IGVudGl0eS50YWJsZS5uYW1lLFxuICAgICAgICAgIFwiSXRlbS4kXCI6IFwiJC5vYmplY3RcIixcbiAgICAgICAgfSxcbiAgICAgICAgUmVzdWx0UGF0aDogbnVsbCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLmNoYWluID0gZ2VuZXJhdGVVdWlkXG4gICAgICAubmV4dChnZXROdWxsSW5wdXRWYWx1ZXNUYXNrKVxuICAgICAgLm5leHQobWVyZ2VJbnB1dFRhc2spXG4gICAgICAubmV4dChtYXBUb0FycmF5VGFzaylcbiAgICAgIC5uZXh0KGFwcGx5QXR0cmlidXRlUHJvcGVydGllc1Rhc2spXG4gICAgICAubmV4dChnZXREYXRhQXNBcnJheVRhc2spXG4gICAgICAubmV4dChzZXBhcmF0ZUZyb21QbGFjZWhvbGRlclRhc2spXG4gICAgICAubmV4dChnZXRBbGxUcmFuc2Zvcm1lZERhdGFBc0FycmF5VGFzaylcbiAgICAgIC5uZXh0KGtlZXBSZWxldmFudFZhbHVlVGFzaylcbiAgICAgIC5uZXh0KGdldEZpcnN0SXRlbVRhc2spXG4gICAgICAubmV4dChwdXRJdGVtVGFzayk7XG4gIH1cbn1cbiJdfQ==
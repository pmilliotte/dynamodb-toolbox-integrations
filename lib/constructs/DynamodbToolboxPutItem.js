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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRHluYW1vZGJUb29sYm94UHV0SXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkR5bmFtb2RiVG9vbGJveFB1dEl0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUVBQXlFO0FBQ3pFLDJDQUF1QztBQUV2QyxnRkFBNkU7QUFDN0Usd0ZBQXFGO0FBQ3JGLDREQUF5RDtBQUN6RCx3REFBcUQ7QUFDckQsa0ZBQStFO0FBQy9FLGtFQUErRDtBQUMvRCxvREFBaUQ7QUFDakQsOEVBQTJFO0FBTTNFLE1BQWEsc0JBQXVCLFNBQVEsc0JBQVM7SUFHbkQsWUFDRSxLQUFnQixFQUNoQixFQUFVLEVBQ1YsRUFBRSxNQUFNLEVBQStCO1FBRXZDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxZQUFZLEdBQUcsSUFBSSx3QkFBSSxDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRTtZQUN0RCxVQUFVLEVBQUU7Z0JBQ1YsK0JBQStCO2dCQUMvQixTQUFTLEVBQUUsR0FBRztnQkFDZCxRQUFRLEVBQUUsZUFBZTthQUMxQjtTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sc0JBQXNCLEdBQUcsSUFBSSx3QkFBSSxDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRTtZQUNoRSxVQUFVLEVBQUU7Z0JBQ1YsU0FBUyxFQUFFLFNBQVM7Z0JBQ3BCLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixzQkFBc0IsRUFBRSxxREFBeUIsQ0FBQyxNQUFNLENBQUM7YUFDMUQ7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLGNBQWMsR0FBRyxJQUFJLHdCQUFJLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQ3RELFVBQVUsRUFBRTtnQkFDVixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsUUFBUSxFQUFFLDREQUE0RDthQUN2RTtTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sY0FBYyxHQUFHLElBQUksd0JBQUksQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDdEQsVUFBVSxFQUFFO2dCQUNWLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixJQUFJLEVBQUUsdUJBQVUsQ0FBQyxNQUFNLENBQUM7YUFDekI7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLDRCQUE0QixHQUFHLElBQUksd0JBQUksQ0FDM0MsSUFBSSxFQUNKLDhCQUE4QixFQUM5QjtZQUNFLFVBQVUsRUFBRTtnQkFDVixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsSUFBSSxFQUFFLG1EQUF3QixDQUFDLE1BQU0sQ0FBQzthQUN2QztTQUNGLENBQ0YsQ0FBQztRQUVGLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSx3QkFBSSxDQUFDLElBQUksRUFBRSxvQkFBb0IsRUFBRTtZQUM5RCxVQUFVLEVBQUU7Z0JBQ1YsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFNBQVMsRUFBRSwrQkFBYyxDQUFDLE1BQU0sQ0FBQzthQUNsQztTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sMkJBQTJCLEdBQUcsSUFBSSx3QkFBSSxDQUMxQyxJQUFJLEVBQ0osNkJBQTZCLEVBQzdCO1lBQ0UsVUFBVSxFQUFFO2dCQUNWLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixNQUFNLEVBQUUsaURBQXVCLENBQUMsTUFBTSxDQUFDO2FBQ3hDO1NBQ0YsQ0FDRixDQUFDO1FBRUYsTUFBTSxnQ0FBZ0MsR0FBRyxJQUFJLHdCQUFJLENBQy9DLElBQUksRUFDSixrQ0FBa0MsRUFDbEM7WUFDRSxVQUFVLEVBQUU7Z0JBQ1YsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFVBQVUsRUFBRSwyREFBNEIsQ0FBQyxNQUFNLENBQUM7YUFDakQ7U0FDRixDQUNGLENBQUM7UUFFRixNQUFNLHFCQUFxQixHQUFHLElBQUksd0JBQUksQ0FBQyxJQUFJLEVBQUUsdUJBQXVCLEVBQUU7WUFDcEUsVUFBVSxFQUFFO2dCQUNWLE1BQU0sRUFBRSxxQ0FBaUIsQ0FBQyxNQUFNLENBQUM7YUFDbEM7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLGdCQUFnQixHQUFHLElBQUksd0JBQUksQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7WUFDMUQsVUFBVSxFQUFFO2dCQUNWLE1BQU0sRUFBRSwyQkFBWSxDQUFDLE1BQU0sQ0FBQzthQUM3QjtTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sV0FBVyxHQUFHLElBQUksK0JBQVcsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ3ZELFNBQVMsRUFBRTtnQkFDVCxJQUFJLEVBQUUsTUFBTTtnQkFDWixRQUFRLEVBQUUsbUNBQW1DO2dCQUM3QyxVQUFVLEVBQUU7b0JBQ1YsU0FBUyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSTtvQkFDNUIsUUFBUSxFQUFFLFVBQVU7aUJBQ3JCO2dCQUNELFVBQVUsRUFBRSxJQUFJO2FBQ2pCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLEtBQUssR0FBRyxZQUFZO2FBQ3RCLElBQUksQ0FBQyxzQkFBc0IsQ0FBQzthQUM1QixJQUFJLENBQUMsY0FBYyxDQUFDO2FBQ3BCLElBQUksQ0FBQyxjQUFjLENBQUM7YUFDcEIsSUFBSSxDQUFDLDRCQUE0QixDQUFDO2FBQ2xDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQzthQUN4QixJQUFJLENBQUMsMkJBQTJCLENBQUM7YUFDakMsSUFBSSxDQUFDLGdDQUFnQyxDQUFDO2FBQ3RDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQzthQUMzQixJQUFJLENBQUMsZ0JBQWdCLENBQUM7YUFDdEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7Q0FDRjtBQXBIRCx3REFvSEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFpbiwgQ3VzdG9tU3RhdGUsIFBhc3MgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLXN0ZXBmdW5jdGlvbnNcIjtcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJjb25zdHJ1Y3RzXCI7XG5pbXBvcnQgeyBFbnRpdHkgfSBmcm9tIFwiLi4vdHlwZXNcIjtcbmltcG9ydCB7IGFwcGx5QXR0cmlidXRlUHJvcGVydGllcyB9IGZyb20gXCIuLi91dGlscy9hcHBseUF0dHJpYnV0ZVByb3BlcnRpZXNcIjtcbmltcG9ydCB7IGdldEFsbFRyYW5zZm9ybWVkRGF0YUFzQXJyYXkgfSBmcm9tIFwiLi4vdXRpbHMvZ2V0QWxsVHJhbnNmb3JtZWREYXRhQXNBcnJheVwiO1xuaW1wb3J0IHsgZ2V0RGF0YUFzQXJyYXkgfSBmcm9tIFwiLi4vdXRpbHMvZ2V0RGF0YUFzQXJyYXlcIjtcbmltcG9ydCB7IGdldEZpcnN0SXRlbSB9IGZyb20gXCIuLi91dGlscy9nZXRGaXJzdEl0ZW1cIjtcbmltcG9ydCB7IGdldFBsYWNlaG9sZGVySW5wdXRWYWx1ZXMgfSBmcm9tIFwiLi4vdXRpbHMvZ2V0UGxhY2Vob2xkZXJJbnB1dFZhbHVlc1wiO1xuaW1wb3J0IHsga2VlcFJlbGV2YW50VmFsdWUgfSBmcm9tIFwiLi4vdXRpbHMva2VlcFJlbGV2YW50VmFsdWVcIjtcbmltcG9ydCB7IG1hcFRvQXJyYXkgfSBmcm9tIFwiLi4vdXRpbHMvbWFwVG9BcnJheVwiO1xuaW1wb3J0IHsgc2VwYXJhdGVGcm9tUGxhY2Vob2xkZXIgfSBmcm9tIFwiLi4vdXRpbHMvc2VwYXJhdGVGcm9tUGxhY2Vob2xkZXJcIjtcblxuZXhwb3J0IGludGVyZmFjZSBEeW5hbW9kYlRvb2xib3hQdXRJdGVtUHJvcHMge1xuICBlbnRpdHk6IEVudGl0eTtcbn1cblxuZXhwb3J0IGNsYXNzIER5bmFtb2RiVG9vbGJveFB1dEl0ZW0gZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICBwdWJsaWMgY2hhaW46IENoYWluO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHNjb3BlOiBDb25zdHJ1Y3QsXG4gICAgaWQ6IHN0cmluZyxcbiAgICB7IGVudGl0eSB9OiBEeW5hbW9kYlRvb2xib3hQdXRJdGVtUHJvcHNcbiAgKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IGdlbmVyYXRlVXVpZCA9IG5ldyBQYXNzKHRoaXMsIFwiR2VuZXJhdGVVdWlkVGFza1wiLCB7XG4gICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgIC8vIFRvIGJlIGNoYW5nZWQgd2l0aCBpbnB1dFBhdGhcbiAgICAgICAgXCJpbnB1dC4kXCI6IFwiJFwiLFxuICAgICAgICBcInV1aWQuJFwiOiBcIlN0YXRlcy5VVUlEKClcIixcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBnZXROdWxsSW5wdXRWYWx1ZXNUYXNrID0gbmV3IFBhc3ModGhpcywgXCJJbnRlcm1lZGlhcnlUYXNrXCIsIHtcbiAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgXCJpbnB1dC4kXCI6IFwiJC5pbnB1dFwiLFxuICAgICAgICBcInV1aWQuJFwiOiBcIiQudXVpZFwiLFxuICAgICAgICBwbGFjZWhvbGRlcklucHV0VmFsdWVzOiBnZXRQbGFjZWhvbGRlcklucHV0VmFsdWVzKGVudGl0eSksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgbWVyZ2VJbnB1dFRhc2sgPSBuZXcgUGFzcyh0aGlzLCBcIk1lcmdlSW5wdXRUYXNrXCIsIHtcbiAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgXCJ1dWlkLiRcIjogXCIkLnV1aWRcIixcbiAgICAgICAgXCJkYXRhLiRcIjogXCJTdGF0ZXMuSnNvbk1lcmdlKCQucGxhY2Vob2xkZXJJbnB1dFZhbHVlcywgJC5pbnB1dCwgZmFsc2UpXCIsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgbWFwVG9BcnJheVRhc2sgPSBuZXcgUGFzcyh0aGlzLCBcIk1hcFRvQXJyYXlUYXNrXCIsIHtcbiAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgXCJ1dWlkLiRcIjogXCIkLnV1aWRcIixcbiAgICAgICAgZGF0YTogbWFwVG9BcnJheShlbnRpdHkpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGFwcGx5QXR0cmlidXRlUHJvcGVydGllc1Rhc2sgPSBuZXcgUGFzcyhcbiAgICAgIHRoaXMsXG4gICAgICBcIkFwcGx5QXR0cmlidXRlUHJvcGVydGllc1Rhc2tcIixcbiAgICAgIHtcbiAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgIFwidXVpZC4kXCI6IFwiJC51dWlkXCIsXG4gICAgICAgICAgZGF0YTogYXBwbHlBdHRyaWJ1dGVQcm9wZXJ0aWVzKGVudGl0eSksXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgKTtcblxuICAgIGNvbnN0IGdldERhdGFBc0FycmF5VGFzayA9IG5ldyBQYXNzKHRoaXMsIFwiR2V0RGF0YUFzQXJyYXlUYXNrXCIsIHtcbiAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgXCJ1dWlkLiRcIjogXCIkLnV1aWRcIixcbiAgICAgICAgXCJhcnJheS4kXCI6IGdldERhdGFBc0FycmF5KGVudGl0eSksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc2VwYXJhdGVGcm9tUGxhY2Vob2xkZXJUYXNrID0gbmV3IFBhc3MoXG4gICAgICB0aGlzLFxuICAgICAgXCJTZXBhcmF0ZUZyb21QbGFjZWhvbGRlclRhc2tcIixcbiAgICAgIHtcbiAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgIFwidXVpZC4kXCI6IFwiJC51dWlkXCIsXG4gICAgICAgICAgYXJyYXlzOiBzZXBhcmF0ZUZyb21QbGFjZWhvbGRlcihlbnRpdHkpLFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICk7XG5cbiAgICBjb25zdCBnZXRBbGxUcmFuc2Zvcm1lZERhdGFBc0FycmF5VGFzayA9IG5ldyBQYXNzKFxuICAgICAgdGhpcyxcbiAgICAgIFwiR2V0QWxsVHJhbnNmb3JtZWREYXRhQXNBcnJheVRhc2tcIixcbiAgICAgIHtcbiAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgIFwidXVpZC4kXCI6IFwiJC51dWlkXCIsXG4gICAgICAgICAgXCJhcnJheXMuJFwiOiBnZXRBbGxUcmFuc2Zvcm1lZERhdGFBc0FycmF5KGVudGl0eSksXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgKTtcblxuICAgIGNvbnN0IGtlZXBSZWxldmFudFZhbHVlVGFzayA9IG5ldyBQYXNzKHRoaXMsIFwiS2VlcFJlbGV2YW50VmFsdWVUYXNrXCIsIHtcbiAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgb2JqZWN0OiBrZWVwUmVsZXZhbnRWYWx1ZShlbnRpdHkpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGdldEZpcnN0SXRlbVRhc2sgPSBuZXcgUGFzcyh0aGlzLCBcIkdldEZpcnN0SXRlbVRhc2tcIiwge1xuICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICBvYmplY3Q6IGdldEZpcnN0SXRlbShlbnRpdHkpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHB1dEl0ZW1UYXNrID0gbmV3IEN1c3RvbVN0YXRlKHRoaXMsIFwiUHV0SXRlbVRhc2tcIiwge1xuICAgICAgc3RhdGVKc29uOiB7XG4gICAgICAgIFR5cGU6IFwiVGFza1wiLFxuICAgICAgICBSZXNvdXJjZTogXCJhcm46YXdzOnN0YXRlczo6OmR5bmFtb2RiOnB1dEl0ZW1cIixcbiAgICAgICAgUGFyYW1ldGVyczoge1xuICAgICAgICAgIFRhYmxlTmFtZTogZW50aXR5LnRhYmxlLm5hbWUsXG4gICAgICAgICAgXCJJdGVtLiRcIjogXCIkLm9iamVjdFwiLFxuICAgICAgICB9LFxuICAgICAgICBSZXN1bHRQYXRoOiBudWxsLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMuY2hhaW4gPSBnZW5lcmF0ZVV1aWRcbiAgICAgIC5uZXh0KGdldE51bGxJbnB1dFZhbHVlc1Rhc2spXG4gICAgICAubmV4dChtZXJnZUlucHV0VGFzaylcbiAgICAgIC5uZXh0KG1hcFRvQXJyYXlUYXNrKVxuICAgICAgLm5leHQoYXBwbHlBdHRyaWJ1dGVQcm9wZXJ0aWVzVGFzaylcbiAgICAgIC5uZXh0KGdldERhdGFBc0FycmF5VGFzaylcbiAgICAgIC5uZXh0KHNlcGFyYXRlRnJvbVBsYWNlaG9sZGVyVGFzaylcbiAgICAgIC5uZXh0KGdldEFsbFRyYW5zZm9ybWVkRGF0YUFzQXJyYXlUYXNrKVxuICAgICAgLm5leHQoa2VlcFJlbGV2YW50VmFsdWVUYXNrKVxuICAgICAgLm5leHQoZ2V0Rmlyc3RJdGVtVGFzaylcbiAgICAgIC5uZXh0KHB1dEl0ZW1UYXNrKTtcbiAgfVxufVxuIl19
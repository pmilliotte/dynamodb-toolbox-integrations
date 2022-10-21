"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cdk_lib_1 = require("aws-cdk-lib");
const entity_1 = require("./dynamodb-toolbox/entity");
const aws_stepfunctions_1 = require("aws-cdk-lib/aws-stepfunctions");
const aws_dynamodb_1 = require("aws-cdk-lib/aws-dynamodb");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const path = require("path");
const lib_1 = require("../lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const aws_lambda_nodejs_1 = require("aws-cdk-lib/aws-lambda-nodejs");
const app = new aws_cdk_lib_1.App();
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        const testTable = new aws_dynamodb_1.Table(this, "BigTable", {
            partitionKey: { name: "type", type: aws_dynamodb_1.AttributeType.STRING },
            sortKey: { name: "id", type: aws_dynamodb_1.AttributeType.STRING },
            tableName: "Test",
            billingMode: aws_dynamodb_1.BillingMode.PAY_PER_REQUEST,
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
        });
        // // Put item lambda
        const lambdaPutItemRole = new aws_iam_1.Role(this, "DynamodbPut", {
            assumedBy: new aws_iam_1.ServicePrincipal("lambda.amazonaws.com"),
        });
        lambdaPutItemRole.addToPolicy(new aws_iam_1.PolicyStatement({
            actions: ["dynamodb:PutItem"],
            resources: [testTable.tableArn],
        }));
        const { functionName } = new aws_lambda_nodejs_1.NodejsFunction(this, "LambdaPutItem", {
            functionName: "Putitemlambda",
            handler: "main",
            entry: path.join(__dirname, `/functions/putItem.ts`),
            role: lambdaPutItemRole,
        });
        this.functionName = functionName;
        const { chain } = new lib_1.DynamodbToolboxPutItem(this, `Put`, {
            // @ts-expect-error
            entity: entity_1.TestEntity,
        });
        new aws_stepfunctions_1.StateMachine(this, "StepFunction", {
            stateMachineName: "SaveAnimalStepFunction2",
            definition: chain.next(new aws_stepfunctions_1.Succeed(scope, "SuccessTask")),
            stateMachineType: aws_stepfunctions_1.StateMachineType.EXPRESS,
        });
    }
}
const testCase = new TestStack(app, "testStack");
const integ = new integ_tests_alpha_1.IntegTest(app, "testCase", {
    testCases: [testCase],
});
const invoke = integ.assertions.invokeFunction({
    functionName: testCase.functionName,
    invocationType: integ_tests_alpha_1.InvocationType.REQUEST_RESPONE,
    logType: integ_tests_alpha_1.LogType.NONE,
    payload: JSON.stringify({ type: "Hello" }),
});
invoke.expect(integ_tests_alpha_1.ExpectedResult.objectLike({ Payload: '"ok"' }));
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50Zy5keW5hbW9kYi10b29sYm94LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50Zy5keW5hbW9kYi10b29sYm94LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkNBQXdEO0FBQ3hELHNEQUF1RDtBQUN2RCxxRUFJdUM7QUFDdkMsMkRBQTZFO0FBQzdFLGlEQUE4RTtBQUM5RSw2QkFBNkI7QUFDN0IsZ0NBQWdEO0FBQ2hELGtFQUtvQztBQUNwQyxxRUFBK0Q7QUFFL0QsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFFdEIsTUFBTSxTQUFVLFNBQVEsbUJBQUs7SUFHM0IsWUFBWSxLQUFVLEVBQUUsRUFBVTtRQUNoQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sU0FBUyxHQUFHLElBQUksb0JBQUssQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQzVDLFlBQVksRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLDRCQUFhLENBQUMsTUFBTSxFQUFFO1lBQzFELE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLDRCQUFhLENBQUMsTUFBTSxFQUFFO1lBQ25ELFNBQVMsRUFBRSxNQUFNO1lBQ2pCLFdBQVcsRUFBRSwwQkFBVyxDQUFDLGVBQWU7WUFDeEMsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztTQUNyQyxDQUFDLENBQUM7UUFFSCxxQkFBcUI7UUFDckIsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLGNBQUksQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ3RELFNBQVMsRUFBRSxJQUFJLDBCQUFnQixDQUFDLHNCQUFzQixDQUFDO1NBQ3hELENBQUMsQ0FBQztRQUNILGlCQUFpQixDQUFDLFdBQVcsQ0FDM0IsSUFBSSx5QkFBZSxDQUFDO1lBQ2xCLE9BQU8sRUFBRSxDQUFDLGtCQUFrQixDQUFDO1lBQzdCLFNBQVMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7U0FDaEMsQ0FBQyxDQUNILENBQUM7UUFFRixNQUFNLEVBQUUsWUFBWSxFQUFFLEdBQUcsSUFBSSxrQ0FBYyxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDakUsWUFBWSxFQUFFLGVBQWU7WUFDN0IsT0FBTyxFQUFFLE1BQU07WUFDZixLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsdUJBQXVCLENBQUM7WUFDcEQsSUFBSSxFQUFFLGlCQUFpQjtTQUN4QixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztRQUVqQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsSUFBSSw0QkFBc0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO1lBQ3hELG1CQUFtQjtZQUNuQixNQUFNLEVBQUUsbUJBQVU7U0FDbkIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxnQ0FBWSxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDckMsZ0JBQWdCLEVBQUUseUJBQXlCO1lBQzNDLFVBQVUsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksMkJBQU8sQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDekQsZ0JBQWdCLEVBQUUsb0NBQWdCLENBQUMsT0FBTztTQUMzQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLFFBQVEsR0FBRyxJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFFakQsTUFBTSxLQUFLLEdBQUcsSUFBSSw2QkFBUyxDQUFDLEdBQUcsRUFBRSxVQUFVLEVBQUU7SUFDM0MsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDO0NBQ3RCLENBQUMsQ0FBQztBQUVILE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO0lBQzdDLFlBQVksRUFBRSxRQUFRLENBQUMsWUFBWTtJQUNuQyxjQUFjLEVBQUUsa0NBQWMsQ0FBQyxlQUFlO0lBQzlDLE9BQU8sRUFBRSwyQkFBTyxDQUFDLElBQUk7SUFDckIsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUM7Q0FDM0MsQ0FBQyxDQUFDO0FBRUgsTUFBTSxDQUFDLE1BQU0sQ0FBQyxrQ0FBYyxDQUFDLFVBQVUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFFOUQsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwLCBSZW1vdmFsUG9saWN5LCBTdGFjayB9IGZyb20gXCJhd3MtY2RrLWxpYlwiO1xuaW1wb3J0IHsgVGVzdEVudGl0eSB9IGZyb20gXCIuL2R5bmFtb2RiLXRvb2xib3gvZW50aXR5XCI7XG5pbXBvcnQge1xuICBTdGF0ZU1hY2hpbmUsXG4gIFN0YXRlTWFjaGluZVR5cGUsXG4gIFN1Y2NlZWQsXG59IGZyb20gXCJhd3MtY2RrLWxpYi9hd3Mtc3RlcGZ1bmN0aW9uc1wiO1xuaW1wb3J0IHsgQXR0cmlidXRlVHlwZSwgQmlsbGluZ01vZGUsIFRhYmxlIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1keW5hbW9kYlwiO1xuaW1wb3J0IHsgUG9saWN5U3RhdGVtZW50LCBSb2xlLCBTZXJ2aWNlUHJpbmNpcGFsIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1pYW1cIjtcbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IER5bmFtb2RiVG9vbGJveFB1dEl0ZW0gfSBmcm9tIFwiLi4vbGliXCI7XG5pbXBvcnQge1xuICBFeHBlY3RlZFJlc3VsdCxcbiAgSW50ZWdUZXN0LFxuICBJbnZvY2F0aW9uVHlwZSxcbiAgTG9nVHlwZSxcbn0gZnJvbSBcIkBhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhXCI7XG5pbXBvcnQgeyBOb2RlanNGdW5jdGlvbiB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtbGFtYmRhLW5vZGVqc1wiO1xuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgcHVibGljIGZ1bmN0aW9uTmFtZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBBcHAsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgdGVzdFRhYmxlID0gbmV3IFRhYmxlKHRoaXMsIFwiQmlnVGFibGVcIiwge1xuICAgICAgcGFydGl0aW9uS2V5OiB7IG5hbWU6IFwidHlwZVwiLCB0eXBlOiBBdHRyaWJ1dGVUeXBlLlNUUklORyB9LFxuICAgICAgc29ydEtleTogeyBuYW1lOiBcImlkXCIsIHR5cGU6IEF0dHJpYnV0ZVR5cGUuU1RSSU5HIH0sXG4gICAgICB0YWJsZU5hbWU6IFwiVGVzdFwiLFxuICAgICAgYmlsbGluZ01vZGU6IEJpbGxpbmdNb2RlLlBBWV9QRVJfUkVRVUVTVCxcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICB9KTtcblxuICAgIC8vIC8vIFB1dCBpdGVtIGxhbWJkYVxuICAgIGNvbnN0IGxhbWJkYVB1dEl0ZW1Sb2xlID0gbmV3IFJvbGUodGhpcywgXCJEeW5hbW9kYlB1dFwiLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKFwibGFtYmRhLmFtYXpvbmF3cy5jb21cIiksXG4gICAgfSk7XG4gICAgbGFtYmRhUHV0SXRlbVJvbGUuYWRkVG9Qb2xpY3koXG4gICAgICBuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgYWN0aW9uczogW1wiZHluYW1vZGI6UHV0SXRlbVwiXSxcbiAgICAgICAgcmVzb3VyY2VzOiBbdGVzdFRhYmxlLnRhYmxlQXJuXSxcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIGNvbnN0IHsgZnVuY3Rpb25OYW1lIH0gPSBuZXcgTm9kZWpzRnVuY3Rpb24odGhpcywgXCJMYW1iZGFQdXRJdGVtXCIsIHtcbiAgICAgIGZ1bmN0aW9uTmFtZTogXCJQdXRpdGVtbGFtYmRhXCIsXG4gICAgICBoYW5kbGVyOiBcIm1haW5cIixcbiAgICAgIGVudHJ5OiBwYXRoLmpvaW4oX19kaXJuYW1lLCBgL2Z1bmN0aW9ucy9wdXRJdGVtLnRzYCksXG4gICAgICByb2xlOiBsYW1iZGFQdXRJdGVtUm9sZSxcbiAgICB9KTtcblxuICAgIHRoaXMuZnVuY3Rpb25OYW1lID0gZnVuY3Rpb25OYW1lO1xuXG4gICAgY29uc3QgeyBjaGFpbiB9ID0gbmV3IER5bmFtb2RiVG9vbGJveFB1dEl0ZW0odGhpcywgYFB1dGAsIHtcbiAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgIGVudGl0eTogVGVzdEVudGl0eSxcbiAgICB9KTtcblxuICAgIG5ldyBTdGF0ZU1hY2hpbmUodGhpcywgXCJTdGVwRnVuY3Rpb25cIiwge1xuICAgICAgc3RhdGVNYWNoaW5lTmFtZTogXCJTYXZlQW5pbWFsU3RlcEZ1bmN0aW9uMlwiLFxuICAgICAgZGVmaW5pdGlvbjogY2hhaW4ubmV4dChuZXcgU3VjY2VlZChzY29wZSwgXCJTdWNjZXNzVGFza1wiKSksXG4gICAgICBzdGF0ZU1hY2hpbmVUeXBlOiBTdGF0ZU1hY2hpbmVUeXBlLkVYUFJFU1MsXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgdGVzdENhc2UgPSBuZXcgVGVzdFN0YWNrKGFwcCwgXCJ0ZXN0U3RhY2tcIik7XG5cbmNvbnN0IGludGVnID0gbmV3IEludGVnVGVzdChhcHAsIFwidGVzdENhc2VcIiwge1xuICB0ZXN0Q2FzZXM6IFt0ZXN0Q2FzZV0sXG59KTtcblxuY29uc3QgaW52b2tlID0gaW50ZWcuYXNzZXJ0aW9ucy5pbnZva2VGdW5jdGlvbih7XG4gIGZ1bmN0aW9uTmFtZTogdGVzdENhc2UuZnVuY3Rpb25OYW1lLFxuICBpbnZvY2F0aW9uVHlwZTogSW52b2NhdGlvblR5cGUuUkVRVUVTVF9SRVNQT05FLFxuICBsb2dUeXBlOiBMb2dUeXBlLk5PTkUsXG4gIHBheWxvYWQ6IEpTT04uc3RyaW5naWZ5KHsgdHlwZTogXCJIZWxsb1wiIH0pLFxufSk7XG5cbmludm9rZS5leHBlY3QoRXhwZWN0ZWRSZXN1bHQub2JqZWN0TGlrZSh7IFBheWxvYWQ6ICdcIm9rXCInIH0pKTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=
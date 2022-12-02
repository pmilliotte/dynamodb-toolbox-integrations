import { PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";

type UpdateItemTestProps = { tableArn: string; stateMachineArn: string };

export class UpdateItemTestLambdaFunction extends Construct {
  public updateItemTestLambdaName: string;
  constructor(
    scope: Construct,
    id: string,
    { tableArn, stateMachineArn }: UpdateItemTestProps
  ) {
    super(scope, id);

    const role = new Role(this, "DynamodbUpdate", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    });
    role.addToPolicy(
      new PolicyStatement({
        actions: [
          "dynamodb:UpdateItem",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
        ],
        resources: [tableArn],
      })
    );
    role.addToPolicy(
      new PolicyStatement({
        actions: ["states:StartSyncExecution"],
        resources: [stateMachineArn],
      })
    );

    const { functionName } = new NodejsFunction(this, "UpdateItemTest", {
      handler: "main",
      // Get the file built
      entry: path.join(__dirname, `/handler.js`),
      role,
      environment: { stateMachineArn },
    });
    this.updateItemTestLambdaName = functionName;
  }
}

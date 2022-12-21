import { PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";

type GetItemSdkProps = { tableArn: string; tableName: string };

export class GetItemSdk extends Construct {
  public functionName: string;
  constructor(
    scope: Construct,
    id: string,
    { tableArn, tableName }: GetItemSdkProps
  ) {
    super(scope, id);

    const role = new Role(this, "DynamodbPut", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    });
    role.addToPolicy(
      new PolicyStatement({
        actions: ["dynamodb:PutItem", "dynamodb:GetItem"],
        resources: [tableArn],
      })
    );

    const { functionName } = new NodejsFunction(this, "GetItemSdk", {
      handler: "main",
      // Get the file built
      entry: path.join(__dirname, `/handler.js`),
      role,
      environment: { tableName },
    });
    this.functionName = functionName;
  }
}

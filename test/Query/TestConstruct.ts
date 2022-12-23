import { PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";

type QueryTestProps = { tableArn: string; stateMachineArn: string };

export class QueryTest extends Construct {
  public functionName: string;
  constructor(
    scope: Construct,
    id: string,
    { tableArn, stateMachineArn }: QueryTestProps
  ) {
    super(scope, id);

    const role = new Role(this, "DynamodbGet", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    });
    role.addToPolicy(
      new PolicyStatement({
        actions: ["dynamodb:PutItem", "dynamodb:Query"],
        resources: [tableArn],
      })
    );
    role.addToPolicy(
      new PolicyStatement({
        actions: ["states:StartSyncExecution"],
        resources: [stateMachineArn],
      })
    );

    const { functionName } = new NodejsFunction(this, "QueryTest", {
      handler: "main",
      // Get the file built
      entry: path.join(__dirname, `/handler.js`),
      role,
      environment: { stateMachineArn },
    });
    this.functionName = functionName;
  }
}

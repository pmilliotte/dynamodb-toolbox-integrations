import { PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";

type PutItemConstructProps = { tableArn: string; stateMachineArn: string };

export class PutItemConstruct extends Construct {
  public functionName: string;
  constructor(
    scope: Construct,
    id: string,
    { tableArn, stateMachineArn }: PutItemConstructProps
  ) {
    super(scope, id);

    // // Put item lambda
    const lambdaPutItemRole = new Role(this, "DynamodbPut", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    });
    lambdaPutItemRole.addToPolicy(
      new PolicyStatement({
        actions: ["dynamodb:PutItem", "dynamodb:GetItem"],
        resources: [tableArn],
      })
    );
    lambdaPutItemRole.addToPolicy(
      new PolicyStatement({
        actions: ["states:StartSyncExecution"],
        resources: [stateMachineArn],
      })
    );

    const { functionName } = new NodejsFunction(this, "LambdaPutItem", {
      functionName: "Putitemlambda",
      handler: "main",
      // Get the file built
      entry: path.join(__dirname, `/putItem.js`),
      role: lambdaPutItemRole,
      environment: { stateMachineArn: stateMachineArn },
    });
    this.functionName = functionName;
  }
}

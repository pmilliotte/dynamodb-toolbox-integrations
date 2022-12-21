import { PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";

type PutItemDynamodbToolboxProps = { tableArn: string; };

export class PutItemDynamodbToolbox extends Construct {
  public functionName: string;
  constructor(
    scope: Construct,
    id: string,
    { tableArn }: PutItemDynamodbToolboxProps
  ) {
    super(scope, id);

    const role = new Role(this, "PutItemDynamodbToolboxRole", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    });
    role.addToPolicy(
      new PolicyStatement({
        actions: ["dynamodb:PutItem"],
        resources: [tableArn],
      })
    );

    const { functionName } = new NodejsFunction(
      this,
      "PutItemDynamodbToolboxLambda",
      {
        handler: "main",
        // Get the file built
        entry: path.join(__dirname, `/handler.js`),
        role,
      }
    );
    this.functionName = functionName;
  }
}

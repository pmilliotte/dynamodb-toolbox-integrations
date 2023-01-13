import {
  ManagedPolicy,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";

type GetItemDynamodbToolboxProps = { tableArn: string; entityName: string };

export class GetItemDynamodbToolbox extends Construct {
  public functionName: string;
  constructor(
    scope: Construct,
    id: string,
    { tableArn, entityName }: GetItemDynamodbToolboxProps
  ) {
    super(scope, id);

    const role = new Role(this, "GetItemDynamodbToolboxRole", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    });
    role.addToPolicy(
      new PolicyStatement({
        actions: ["dynamodb:GetItem"],
        resources: [tableArn],
      })
    );
    role.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        "service-role/AWSLambdaBasicExecutionRole"
      )
    );

    const { functionName } = new NodejsFunction(
      this,
      "GetItemDynamodbToolboxLambda",
      {
        handler: "main",
        // Get the file built
        entry: path.join(__dirname, `/handler.js`),
        role,
        environment: { entityName },
      }
    );
    this.functionName = functionName;
  }
}

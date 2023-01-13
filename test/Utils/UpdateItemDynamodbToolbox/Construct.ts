import {
  ManagedPolicy,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";

type UpdateItemDynamodbToolboxProps = { tableArn: string; entityName: string };

export class UpdateItemDynamodbToolbox extends Construct {
  public functionName: string;
  constructor(
    scope: Construct,
    id: string,
    { tableArn, entityName }: UpdateItemDynamodbToolboxProps
  ) {
    super(scope, id);

    const role = new Role(this, "UpdateItemDynamodbToolboxRole", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    });
    role.addToPolicy(
      new PolicyStatement({
        actions: ["dynamodb:UpdateItem"],
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
      "UpdateItemDynamodbToolboxLambda",
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

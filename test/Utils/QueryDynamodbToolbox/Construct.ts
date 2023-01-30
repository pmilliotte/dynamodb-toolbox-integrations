import {
  ManagedPolicy,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";

type QueryDynamodbToolboxProps = { tableArn: string; entityName: string };

export class QueryDynamodbToolbox extends Construct {
  public functionName: string;
  constructor(
    scope: Construct,
    id: string,
    { tableArn, entityName }: QueryDynamodbToolboxProps
  ) {
    super(scope, id);

    const role = new Role(this, "QueryDynamodbToolboxRole", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    });
    role.addToPolicy(
      new PolicyStatement({
        actions: ["dynamodb:Query"],
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
      "QueryDynamodbToolboxLambda",
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

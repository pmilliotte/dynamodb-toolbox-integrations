import { PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import {
  StateMachine,
  StateMachineType,
  Succeed,
} from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import { DynamodbToolboxUpdateItem } from "../../lib";
import { updateItemEntityTest } from "./testUtils";
import { UpdateItemTestLambdaFunction } from "./UpdateItemTestLambdaFunction";

type UpdateItemTestProps = { tableArn: string };

export class UpdateItemTestConstruct extends Construct {
  public updateItemTestLambdaName: string;
  constructor(scope: Construct, id: string, { tableArn }: UpdateItemTestProps) {
    super(scope, id);

    const { chain } = new DynamodbToolboxUpdateItem(this, `Put`, {
      // @ts-expect-error
      entity: updateItemEntityTest,
    });

    const stateMachine = new StateMachine(this, "UpdateItemStepFunction", {
      definition: chain.next(new Succeed(scope, "SuccessTask")),
      // Express needed for future get sync
      stateMachineType: StateMachineType.EXPRESS,
    });
    const { stateMachineArn } = stateMachine;

    stateMachine.addToRolePolicy(
      new PolicyStatement({
        actions: ["dynamodb:UpdateItem"],
        resources: [tableArn],
      })
    );

    const updateItemTest = new UpdateItemTestLambdaFunction(
      this,
      "UpdateItemTest",
      {
        tableArn,
        stateMachineArn,
      }
    );

    this.updateItemTestLambdaName = updateItemTest.updateItemTestLambdaName;
  }
}

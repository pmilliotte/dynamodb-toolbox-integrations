import {
  StateMachine,
  StateMachineType,
  Succeed,
} from "aws-cdk-lib/aws-stepfunctions";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { DynamodbToolboxPutItem } from "../../lib";
import { PutItemDynamodbToolbox } from "../PutItemDynamodbToolbox/Construct";
import { Construct } from "constructs";
import { TestEntity } from "../dynamodb-toolbox";

type PutItemTestConstructProps = { tableArn: string };

export class PutItemStateMachine extends Construct {
  public putItemDynamodbToolboxFunctionName: string;
  public putItemStateMachineArn: string;

  constructor(
    scope: Construct,
    id: string,
    { tableArn }: PutItemTestConstructProps
  ) {
    super(scope, id);

    const { chain } = new DynamodbToolboxPutItem(this, `Put`, {
      // @ts-expect-error
      entity: TestEntity,
    });

    const stateMachine = new StateMachine(this, "PutStepFunction", {
      definition: chain.next(new Succeed(scope, "PutSuccessTask")),
      // Express needed for future get sync
      stateMachineType: StateMachineType.EXPRESS,
    });
    const { stateMachineArn } = stateMachine;
    this.putItemStateMachineArn = stateMachineArn;

    stateMachine.addToRolePolicy(
      new PolicyStatement({
        actions: ["dynamodb:PutItem"],
        resources: [tableArn],
      })
    );
  }
}

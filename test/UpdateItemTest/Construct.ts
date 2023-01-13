import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import {
  LogLevel,
  StateMachine,
  StateMachineType,
  Succeed,
} from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import { DynamodbToolboxUpdateItem } from "../../lib";
import { TestUpdateEntity } from "./dynamodb-toolbox";

type UpdateItemStateMachineProps = { tableArn: string };

export class UpdateItemStateMachine extends Construct {
  public updateItemStateMachineArn: string;

  constructor(
    scope: Construct,
    id: string,
    { tableArn }: UpdateItemStateMachineProps
  ) {
    super(scope, id);

    const { chain } = new DynamodbToolboxUpdateItem(this, `Update`, {
      // @ts-expect-error
      entity: TestUpdateEntity,
    });

    const logGroup = new LogGroup(this, "UpdateLogGroup");

    const stateMachine = new StateMachine(this, "UpdateStepFunction", {
      definition: chain.next(new Succeed(scope, "UpdateSuccessTask")),
      // Express needed for future get sync
      stateMachineType: StateMachineType.EXPRESS,
      logs: {
        destination: logGroup,
        level: LogLevel.ALL,
      },
    });
    const { stateMachineArn } = stateMachine;
    this.updateItemStateMachineArn = stateMachineArn;

    stateMachine.addToRolePolicy(
      new PolicyStatement({
        actions: ["dynamodb:UpdateItem"],
        resources: [tableArn],
      })
    );
  }
}

import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import {
  LogLevel,
  StateMachine,
  StateMachineType,
  Succeed,
} from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import { DynamodbToolboxGetItem } from "../../lib";
import { TestGetEntity } from "./dynamodb-toolbox";

type GetItemStateMachineProps = { tableArn: string };

export class GetItemStateMachine extends Construct {
  public getItemStateMachineArn: string;

  constructor(
    scope: Construct,
    id: string,
    { tableArn }: GetItemStateMachineProps
  ) {
    super(scope, id);

    const { chain } = new DynamodbToolboxGetItem(this, `Get`, {
      // @ts-expect-error
      entity: TestGetEntity,
    });

    const logGroup = new LogGroup(this, "GetLogGroup");

    const stateMachine = new StateMachine(this, "GetStepFunction", {
      definition: chain.next(new Succeed(scope, "GetSuccessTask")),
      // Express needed for future get sync
      stateMachineType: StateMachineType.EXPRESS,
      logs: {
        destination: logGroup,
        level: LogLevel.ALL,
      },
    });
    const { stateMachineArn } = stateMachine;
    this.getItemStateMachineArn = stateMachineArn;

    stateMachine.addToRolePolicy(
      new PolicyStatement({
        actions: ["dynamodb:GetItem"],
        resources: [tableArn],
      })
    );
  }
}

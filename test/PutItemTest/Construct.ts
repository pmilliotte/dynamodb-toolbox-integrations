import {
  LogLevel,
  StateMachine,
  StateMachineType,
  Succeed,
} from "aws-cdk-lib/aws-stepfunctions";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { DynamodbToolboxPutItem } from "../../lib";
import { Construct } from "constructs";
import { TestPutEntity } from "./dynamodb-toolbox";
import { LogGroup } from "aws-cdk-lib/aws-logs";

type PutItemTestConstructProps = { tableArn: string };

export class PutItemStateMachine extends Construct {
  public putItemStateMachineArn: string;

  constructor(
    scope: Construct,
    id: string,
    { tableArn }: PutItemTestConstructProps
  ) {
    super(scope, id);

    const { chain } = new DynamodbToolboxPutItem(this, `Put`, {
      // @ts-expect-error
      entity: TestPutEntity,
    });

    const logGroup = new LogGroup(this, "PutLogGroup");

    const stateMachine = new StateMachine(this, "PutStepFunction", {
      definition: chain.next(new Succeed(scope, "PutSuccessTask")),
      // Express needed for future get sync
      stateMachineType: StateMachineType.EXPRESS,
      logs: {
        destination: logGroup,
        level: LogLevel.ALL,
      },
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

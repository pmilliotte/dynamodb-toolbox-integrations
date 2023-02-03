import { RemovalPolicy } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import {
  LogLevel,
  StateMachine,
  StateMachineType,
} from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import { DynamodbToolboxGetItem } from "../../lib/constructs/DynamodbToolboxGetItem";
import { TestGetItemEntity } from "./dynamodb-toolbox";

type GetItemStateMachineProps = {
  tableArn: string;
  attributes?: string[];
};

export class StateMachineWithGetItemTask extends Construct {
  public getItemStateMachineArn: string;

  constructor(
    scope: Construct,
    id: string,
    { tableArn, attributes }: GetItemStateMachineProps
  ) {
    super(scope, id);

    const getItemTask = new DynamodbToolboxGetItem(this, `GetItem`, {
      // @ts-expect-error
      entity: TestGetItemEntity,
      tableArn,
      options: { attributes },
    });

    const logGroup = new LogGroup(this, "GetItemLogGroup", {
      retention: RetentionDays.ONE_DAY,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const stateMachine = new StateMachine(this, "GetItemStepFunctionTest", {
      definition: getItemTask,
      stateMachineType: StateMachineType.EXPRESS,
      logs: {
        destination: logGroup,
        level: LogLevel.ALL,
        includeExecutionData: true,
      },
    });
    const { stateMachineArn } = stateMachine;
    this.getItemStateMachineArn = stateMachineArn;
  }
}

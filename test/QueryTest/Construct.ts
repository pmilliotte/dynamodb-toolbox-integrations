import { RemovalPolicy } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import {
  LogLevel,
  StateMachine,
  StateMachineType,
} from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import { DynamodbToolboxQuery } from "../../lib/constructs/DynamodbToolboxQuery";
import { TestQueryEntity } from "./dynamodb-toolbox";

type QueryStateMachineProps = {
  tableArn: string;
  attributes?: string[];
};

export class StateMachineWithQueryTask extends Construct {
  public queryStateMachineArn: string;

  constructor(
    scope: Construct,
    id: string,
    { tableArn, attributes }: QueryStateMachineProps
  ) {
    super(scope, id);

    const queryTask = new DynamodbToolboxQuery(this, "QueryTest", {
      entity: TestQueryEntity,
      tableArn,
      options: { attributes },
    });

    const logGroup = new LogGroup(this, "QueryLogGroup", {
      retention: RetentionDays.ONE_DAY,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const stateMachine = new StateMachine(this, "QueryStepFunctionTest", {
      definition: queryTask,
      // Express needed for future get sync
      stateMachineType: StateMachineType.EXPRESS,
      logs: {
        destination: logGroup,
        level: LogLevel.ALL,
        includeExecutionData: true,
      },
    });
    const { stateMachineArn } = stateMachine;
    this.queryStateMachineArn = stateMachineArn;
  }
}

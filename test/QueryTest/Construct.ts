import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import {
  LogLevel,
  StateMachine,
  StateMachineType,
  Succeed,
} from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import { DynamodbToolboxQuery } from "../../lib/constructs/DynamodbToolboxQuery";
import { TestQueryEntity } from "./dynamodb-toolbox";

type QueryStateMachineProps = {
  tableArn: string;
};

export class StateMachineWithQueryTask extends Construct {
  public queryStateMachineArn: string;

  constructor(
    scope: Construct,
    id: string,
    { tableArn }: QueryStateMachineProps
  ) {
    super(scope, id);

    const queryTask = new DynamodbToolboxQuery(this, `Query`, {
      // @ts-expect-error
      entity: TestQueryEntity,
      tableArn,
      options: { attributes: ["sk"] },
    });

    const logGroup = new LogGroup(this, "QueryLogGroup");

    const stateMachine = new StateMachine(this, "QueryStepFunction", {
      definition: queryTask.next(new Succeed(scope, "QuerySuccessTask")),
      // Express needed for future get sync
      // stateMachineType: StateMachineType.EXPRESS,
      // logs: {
      //   destination: logGroup,
      //   level: LogLevel.ALL,
      // },
    });
    const { stateMachineArn } = stateMachine;
    this.queryStateMachineArn = stateMachineArn;

    stateMachine.addToRolePolicy(
      new PolicyStatement({
        actions: ["dynamodb:Query"],
        resources: [tableArn],
      })
    );
  }
}

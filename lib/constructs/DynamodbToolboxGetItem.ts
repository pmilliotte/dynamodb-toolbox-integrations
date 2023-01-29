import { CustomState } from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import { keysAliasToMap } from "../utils/keysAliasToMap";
import {
  IntegrationPattern,
  StateMachine,
  StateMachineType,
  TaskInput,
} from "aws-cdk-lib/aws-stepfunctions";
import {
  StepFunctionsStartExecution,
  StepFunctionsStartExecutionProps,
} from "aws-cdk-lib/aws-stepfunctions-tasks";
import { DynamodbToolboxIntegrationConstructProps } from "../types";
import { FormatItem } from "./FormatItem";

type DynamodbToolboxGetItemProps = DynamodbToolboxIntegrationConstructProps &
  StepFunctionsStartExecutionProps;

export class DynamodbToolboxGetItem extends StepFunctionsStartExecution {
  constructor(
    scope: Construct,
    id: string,
    { entity, tableArn, ...props }: DynamodbToolboxGetItemProps
  ) {
    const stateJson = {
      Type: "Task",
      Resource: "arn:aws:states:::dynamodb:getItem",
      Parameters: {
        TableName: entity.table.name,
        Key: keysAliasToMap(entity),
      },
      ResultSelector: {
        "item.$": "$.Item",
        "uuid.$": "States.UUID()",
      },
    };

    const getItemTask = new CustomState(scope, "GetItemTask", { stateJson });

    const chain = getItemTask.next(new FormatItem(scope, "Format", { entity }));

    const stateMachine = new StateMachine(scope, "GetItemStepFunction", {
      definition: chain,
      stateMachineType: StateMachineType.EXPRESS,
    });

    const {
      comment,
      inputPath,
      outputPath,
      resultPath,
      resultSelector,
      timeout,
      heartbeat,
      integrationPattern,
      credentials,
      name,
      associateWithParent,
    } = props;

    super(scope, id, {
      stateMachine,
      input: TaskInput.fromObject({
        "stateInput.$": "$",
      }),
      comment,
      inputPath,
      resultPath,
      resultSelector,
      timeout,
      heartbeat,
      integrationPattern: integrationPattern ?? IntegrationPattern.RUN_JOB,
      credentials,
      outputPath: `${outputPath ?? "$"}.Output`,
      name,
      associateWithParent,
    });
  }
}

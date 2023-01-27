import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import {
  IntegrationPattern,
  JsonPath,
  Map,
  StateMachine,
  StateMachineType,
  Succeed,
  TaskInput,
} from "aws-cdk-lib/aws-stepfunctions";
import {
  CallAwsService,
  StepFunctionsStartExecution,
} from "aws-cdk-lib/aws-stepfunctions-tasks";
import { Construct } from "constructs";
import {
  DynamodbToolboxIntegrationConstructProps,
  TYPE_MAPPING,
} from "../types";
import { getPartitionKeyAlias } from "../utils/attributes";
import { FormatItem } from "./FormatItem";

export class DynamodbToolboxQuery extends StepFunctionsStartExecution {
  constructor(
    scope: Construct,
    id: string,
    {
      entity,
      tableArn,
      options,
    }: DynamodbToolboxIntegrationConstructProps & {
      options: { attributes: string[] };
    }
  ) {
    const { type } = entity.schema.attributes[getPartitionKeyAlias(entity)];
    const typeKey = `${TYPE_MAPPING[type]}.$`;
    const parameters = {
      TableName: entity.table.name,
      KeyConditionExpression: "pk = :val",
      ExpressionAttributeValues: {
        ":val": {
          [typeKey]: "$",
        },
      },
    };

    const queryTask = new CallAwsService(scope, "QueryTask", {
      service: "dynamodb",
      action: "query",
      iamResources: ["arn:aws:states:::aws-sdk:dynamodb:query"],
      parameters,
    });

    const map = new Map(scope, "MapItems", {
      itemsPath: JsonPath.stringAt("$.Items"),
    });
    map.iterator(
      new FormatItem(scope, "Format", {
        entity,
        attributes: options.attributes,
      })
    );

    const chain = queryTask.next(map);

    const stateMachine = new StateMachine(scope, "QueryStepFunction", {
      definition: chain.next(new Succeed(scope, "QuerySuccessTask")),
      stateMachineType: StateMachineType.EXPRESS,
    });

    stateMachine.addToRolePolicy(
      new PolicyStatement({
        actions: ["dynamodb:Query"],
        resources: [tableArn],
      })
    );

    super(scope, id, {
      stateMachine,
      integrationPattern: IntegrationPattern.REQUEST_RESPONSE,
      input: TaskInput.fromJsonPathAt("$"),
    });
  }
}

import { App, Stack, DefaultStackSynthesizer, StackProps } from "aws-cdk-lib";
import type { Construct } from "constructs";
import {
  StateMachine,
  StateMachineType,
  Succeed,
} from "aws-cdk-lib/aws-stepfunctions";

import { DynamodbToolboxPutItem } from "./DynamodbToolboxPutItem";
import { TestEntity } from "./DynamoDBToolboxPutItem.fixtures.test";

const app = new App();

class TestStack extends Stack {
  constructor(scope: Construct, constructId?: string, props?: StackProps) {
    super(scope, constructId, props);

    const { chain } = new DynamodbToolboxPutItem(
      this,
      "DynamodbToolboxPutItem",
      {
        // @ts-ignore this is not resolved yet
        entity: TestEntity,
      }
    );

    new StateMachine(this, "StepFunction", {
      stateMachineName: "SaveAnimalStepFunction2",
      definition: chain.next(new Succeed(scope, "SuccessTask")),
      stateMachineType: StateMachineType.EXPRESS,
    });
  }
}

const testStack = new TestStack(app, "testStack", {
  // Override default synthetizer to prevent check related to CDK bootstrap
  synthesizer: new DefaultStackSynthesizer({
    generateBootstrapVersionRule: false,
  }),
});

type Resource = { Type: string; Properties?: { [key: string]: any } };

const stackTemplate = app.synth().getStackByName(testStack.stackName)
  .template as { Resources: Record<string, Resource> };

const stateMachines = Object.values(stackTemplate.Resources).filter(
  (resource) => resource.Type === "AWS::StepFunctions::StateMachine"
);

describe("test", () => {
  it("stateMachines", () => {
    expect(stateMachines).toHaveLength(1);
  });

  const [stateMachine] = stateMachines;

  it("generates expected cloud formation", () => {
    expect(
      JSON.parse(stateMachine.Properties?.DefinitionString as string)
    ).toStrictEqual({
      StartAt: "GenerateUuidTask",
      States: {
        ApplyAttributePropertiesTask: {
          Next: "GetDataAsArrayTask",
          Parameters: {
            data: {
              _ct: {
                attributeMap: "_ct",
                isNull: false,
                isPlaceholder: false,
                nullValue: [null],
                value: [{ "S.$": "$$.State.EnteredTime" }],
              },
              _md: {
                attributeMap: "_md",
                isNull: false,
                isPlaceholder: false,
                nullValue: [null],
                value: [{ "S.$": "$$.State.EnteredTime" }],
              },
              id: {
                attributeMap: "id",
                "isNull.$": "States.ArrayContains($.data['id'], null)",
                "isPlaceholder.$": "States.ArrayContains($.data['id'], $.uuid)",
                null2Value: [null],
                nullValue: [null],
                value: [{ "S.$": "States.Format('{}', $.data.id[0])" }],
              },
              type: {
                attributeMap: "type",
                "isNull.$": "States.ArrayContains($.data['type'], null)",
                "isPlaceholder.$":
                  "States.ArrayContains($.data['type'], $.uuid)",
                null2Value: [null],
                nullValue: [null],
                value: [{ "S.$": "States.Format('{}', $.data.type[0])" }],
              },
            },
            "uuid.$": "$.uuid",
          },
          Type: "Pass",
        },
        GenerateUuidTask: {
          Next: "IntermediaryTask",
          Parameters: {
            "input.$": "$",
            "uuid.$": "States.UUID()",
          },
          Type: "Pass",
        },
        GetAllTransformedDataAsArrayTask: {
          Next: "KeepRelevantValueTask",
          Parameters: {
            "arrays.$":
              "States.Array($.arrays['type.placeholder'], $.arrays['type.input'], $.arrays['type.null'], $.arrays['id.placeholder'], $.arrays['id.input'], $.arrays['id.null'], $.arrays['_ct.placeholder'], $.arrays['_ct.input'], $.arrays['_ct.null'], $.arrays['_md.placeholder'], $.arrays['_md.input'], $.arrays['_md.null'] )",
            "uuid.$": "$.uuid",
          },
          Type: "Pass",
        },
        GetDataAsArrayTask: {
          Next: "SeparateFromPlaceholderTask",
          Parameters: {
            "array.$":
              "States.Array($.data['type'],$.data['id'],$.data['_ct'],$.data['_md'])",
            "uuid.$": "$.uuid",
          },
          Type: "Pass",
        },
        GetFirstItemTask: {
          Next: "PutItemTask",
          Parameters: {
            object: {
              "_ct.$": "$.object._ct[0][0]",
              "_md.$": "$.object._md[0][0]",
              "id.$": "$.object.id[0][0]",
              "type.$": "$.object.type[0][0]",
            },
          },
          Type: "Pass",
        },
        IntermediaryTask: {
          Next: "MergeInputTask",
          Parameters: {
            "input.$": "$.input",
            placeholderInputValues: {
              created: "placeholder",
              "id.$": "States.UUID()",
              modified: "placeholder",
              "type.$": "$.uuid",
            },
            "uuid.$": "$.uuid",
          },
          Type: "Pass",
        },
        KeepRelevantValueTask: {
          Next: "GetFirstItemTask",
          Parameters: {
            object: {
              "_ct.$":
                "$..arrays[?(@.attributeMap=='_ct' && @.length == 1)].value[0]",
              "_md.$":
                "$..arrays[?(@.attributeMap=='_md' && @.length == 1)].value[0]",
              "id.$":
                "$..arrays[?(@.attributeMap=='id' && @.length == 1)].value[0]",
              "type.$":
                "$..arrays[?(@.attributeMap=='type' && @.length == 1)].value[0]",
            },
          },
          Type: "Pass",
        },
        MapToArrayTask: {
          Next: "ApplyAttributePropertiesTask",
          Parameters: {
            data: {
              "_ct.$": "States.Array($.data['created'])",
              "_md.$": "States.Array($.data['modified'])",
              "id.$": "States.Array($.data['id'])",
              "type.$": "States.Array($.data['type'])",
            },
            "uuid.$": "$.uuid",
          },
          Type: "Pass",
        },
        MergeInputTask: {
          Next: "MapToArrayTask",
          Parameters: {
            "data.$":
              "States.JsonMerge($.placeholderInputValues, $.input, false)",
            "uuid.$": "$.uuid",
          },
          Type: "Pass",
        },
        PutItemTask: {
          Next: "SuccessTask",
          Parameters: {
            "Item.$": "$.object",
            TableName: "Test",
          },
          Resource: "arn:aws:states:::dynamodb:putItem",
          ResultPath: null,
          Type: "Task",
        },
        SeparateFromPlaceholderTask: {
          Next: "GetAllTransformedDataAsArrayTask",
          Parameters: {
            arrays: {
              "_ct.input": {
                attributeMap: "_ct",
                "length.$":
                  "States.ArrayLength($.array[?(@.attributeMap=='_ct' && @.isPlaceholder == false && @.isNull == false)].value)",
                "value.$":
                  "$.array[?(@.attributeMap=='_ct' && @.isPlaceholder == false && @.isNull == false)].value",
              },
              "_ct.null": {
                attributeMap: "_ct",
                "length.$":
                  "States.ArrayLength($.array[?(@.attributeMap=='_ct' && @.isNull == true)].null2Value)",
                "value.$":
                  "$.array[?(@.attributeMap=='_ct' && @.isNull == true)].null2Value",
              },
              "_ct.placeholder": {
                attributeMap: "_ct",
                "length.$":
                  "States.ArrayLength($.array[?(@.attributeMap=='_ct' && @.isPlaceholder == true)].nullValue)",
                "value.$":
                  "$.array[?(@.attributeMap=='_ct' && @.isPlaceholder == true)].nullValue",
              },
              "_md.input": {
                attributeMap: "_md",
                "length.$":
                  "States.ArrayLength($.array[?(@.attributeMap=='_md' && @.isPlaceholder == false && @.isNull == false)].value)",
                "value.$":
                  "$.array[?(@.attributeMap=='_md' && @.isPlaceholder == false && @.isNull == false)].value",
              },
              "_md.null": {
                attributeMap: "_md",
                "length.$":
                  "States.ArrayLength($.array[?(@.attributeMap=='_md' && @.isNull == true)].null2Value)",
                "value.$":
                  "$.array[?(@.attributeMap=='_md' && @.isNull == true)].null2Value",
              },
              "_md.placeholder": {
                attributeMap: "_md",
                "length.$":
                  "States.ArrayLength($.array[?(@.attributeMap=='_md' && @.isPlaceholder == true)].nullValue)",
                "value.$":
                  "$.array[?(@.attributeMap=='_md' && @.isPlaceholder == true)].nullValue",
              },
              "id.input": {
                attributeMap: "id",
                "length.$":
                  "States.ArrayLength($.array[?(@.attributeMap=='id' && @.isPlaceholder == false && @.isNull == false)].value)",
                "value.$":
                  "$.array[?(@.attributeMap=='id' && @.isPlaceholder == false && @.isNull == false)].value",
              },
              "id.null": {
                attributeMap: "id",
                "length.$":
                  "States.ArrayLength($.array[?(@.attributeMap=='id' && @.isNull == true)].null2Value)",
                "value.$":
                  "$.array[?(@.attributeMap=='id' && @.isNull == true)].null2Value",
              },
              "id.placeholder": {
                attributeMap: "id",
                "length.$":
                  "States.ArrayLength($.array[?(@.attributeMap=='id' && @.isPlaceholder == true)].nullValue)",
                "value.$":
                  "$.array[?(@.attributeMap=='id' && @.isPlaceholder == true)].nullValue",
              },
              "type.input": {
                attributeMap: "type",
                "length.$":
                  "States.ArrayLength($.array[?(@.attributeMap=='type' && @.isPlaceholder == false && @.isNull == false)].value)",
                "value.$":
                  "$.array[?(@.attributeMap=='type' && @.isPlaceholder == false && @.isNull == false)].value",
              },
              "type.null": {
                attributeMap: "type",
                "length.$":
                  "States.ArrayLength($.array[?(@.attributeMap=='type' && @.isNull == true)].null2Value)",
                "value.$":
                  "$.array[?(@.attributeMap=='type' && @.isNull == true)].null2Value",
              },
              "type.placeholder": {
                attributeMap: "type",
                "length.$":
                  "States.ArrayLength($.array[?(@.attributeMap=='type' && @.isPlaceholder == true)].nullValue)",
                "value.$":
                  "$.array[?(@.attributeMap=='type' && @.isPlaceholder == true)].nullValue",
              },
            },
            "uuid.$": "$.uuid",
          },
          Type: "Pass",
        },
        SuccessTask: {
          Type: "Succeed",
        },
      },
    });
  });
});

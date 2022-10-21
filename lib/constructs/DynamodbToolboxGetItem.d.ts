import { CustomState } from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import { DynamodbToolboxIntegrationConstructProps } from "../utils";
export declare class DynamodbToolboxGetItem extends Construct {
    task: CustomState;
    constructor(scope: Construct, id: string, { entity }: DynamodbToolboxIntegrationConstructProps);
}

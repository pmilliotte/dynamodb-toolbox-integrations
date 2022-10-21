import { Chain } from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import { DynamodbToolboxIntegrationConstructProps } from "../utils/constructProps";
export declare class DynamodbToolboxPutItem extends Construct {
    chain: Chain;
    constructor(scope: Construct, id: string, { entity }: DynamodbToolboxIntegrationConstructProps);
}

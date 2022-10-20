import { Chain } from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import { Entity } from "../types";
export interface DynamodbToolboxPutItemProps {
    entity: Entity;
}
export declare class DynamodbToolboxPutItem extends Construct {
    chain: Chain;
    constructor(scope: Construct, id: string, { entity }: DynamodbToolboxPutItemProps);
}

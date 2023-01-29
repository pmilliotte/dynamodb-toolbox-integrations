import { Entity } from ".";

export interface DynamodbToolboxIntegrationConstructProps {
  entity: Entity;
  tableArn: string;
}

import { Construct } from "constructs";
import { GetItemDynamodbToolbox } from "./GetItemDynamodbToolbox/Construct";
import { GetItemSdk } from "./GetItemSdk/Construct";
import { PutItemDynamodbToolbox } from "./PutItemDynamodbToolbox/Construct";
import { PutItemsDynamodbToolbox } from "./PutItemsDynamodbToolbox/Construct";

import { QueryDynamodbToolbox } from "./QueryDynamodbToolbox/Construct";

type TestUtilsProps = {
  tableName: string;
  tableArn: string;
  entityName: string;
};

export class TestUtils extends Construct {
  public getItemSdkFunctionName: string;
  public putItemDynamodbToolboxFunctionName: string;
  public putItemsDynamodbToolboxFunctionName: string;
  public getItemDynamodbToolboxFunctionName: string;
  public queryDynamodbToolboxFunctionName: string;

  constructor(
    scope: Construct,
    id: string,
    { tableName, tableArn, entityName }: TestUtilsProps
  ) {
    super(scope, id);

    const { functionName: getItemSdkFunctionName } = new GetItemSdk(
      this,
      "GetItemSdk",
      { tableArn, tableName }
    );
    this.getItemSdkFunctionName = getItemSdkFunctionName;

    const { functionName: putItemDynamodbToolboxFunctionName } =
      new PutItemDynamodbToolbox(this, "PutItemDynamodbToolbox", {
        tableArn,
        entityName,
      });
    this.putItemDynamodbToolboxFunctionName =
      putItemDynamodbToolboxFunctionName;

    const { functionName: putItemsDynamodbToolboxFunctionName } =
      new PutItemsDynamodbToolbox(this, "PutItemsDynamodbToolbox", {
        tableArn,
        entityName,
      });
    this.putItemsDynamodbToolboxFunctionName =
      putItemsDynamodbToolboxFunctionName;

    const { functionName: getItemDynamodbToolboxFunctionName } =
      new GetItemDynamodbToolbox(this, "GetItemDynamodbToolbox", {
        tableArn,
        entityName,
      });
    this.getItemDynamodbToolboxFunctionName =
      getItemDynamodbToolboxFunctionName;

    const { functionName: queryDynamodbToolboxFunctionName } =
      new QueryDynamodbToolbox(this, "QueryDynamodbToolbox", {
        tableArn,
        entityName,
      });
    this.queryDynamodbToolboxFunctionName = queryDynamodbToolboxFunctionName;
  }
}

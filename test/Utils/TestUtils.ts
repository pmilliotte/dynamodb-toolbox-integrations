import { Construct } from "constructs";
import { GetItemSdk } from "./GetItemSdk/Construct";
import { PutItemDynamodbToolbox } from "./PutItemDynamodbToolbox/Construct";
import { UpdateItemDynamodbToolbox } from "./UpdateItemDynamodbToolbox/Construct";

type TestUtilsProps = {
  tableName: string;
  tableArn: string;
  entityName: string;
};

export class TestUtils extends Construct {
  public getItemSdkFunctionName: string;
  public putItemDynamodbToolboxFunctionName: string;
  public updateItemDynamodbToolboxFunctionName: string;

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

    const { functionName: updateItemDynamodbToolboxFunctionName } =
      new UpdateItemDynamodbToolbox(this, "UpdateItemDynamodbToolbox", {
        tableArn,
        entityName,
      });
    this.updateItemDynamodbToolboxFunctionName =
      updateItemDynamodbToolboxFunctionName;
  }
}

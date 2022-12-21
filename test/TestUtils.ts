import { Construct } from "constructs";
import { GetItemSdk } from "./GetItemSdk/Construct";
import { PutItemDynamodbToolbox } from "./PutItemDynamodbToolbox/Construct";

type TestUtilsProps = { tableName: string; tableArn: string };

export class TestUtils extends Construct {
  public getItemSdkFunctionName: string;
  public putItemDynamodbToolboxFunctionName: string;

  constructor(
    scope: Construct,
    id: string,
    { tableName, tableArn }: TestUtilsProps
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
      });
    this.putItemDynamodbToolboxFunctionName =
      putItemDynamodbToolboxFunctionName;
  }
}

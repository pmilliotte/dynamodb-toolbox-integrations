import { TestPutEntity } from "../../PutItemTest/dynamodb-toolbox";
import { TestUpdateEntity } from "../../UpdateItemTest/dynamodb-toolbox";
import { TestGetEntity } from "../../GetItemTest/dynamodb-toolbox";
import { TestQueryEntity } from "../../QueryTest/dynamodb-toolbox";

const NAME_TO_ENTITY_MAPPING = {
  [TestPutEntity.name]: TestPutEntity,
  [TestUpdateEntity.name]: TestUpdateEntity,
  [TestGetEntity.name]: TestGetEntity,
  [TestQueryEntity.name]: TestQueryEntity,
};

export const main = async (
  payload: Record<string, unknown>
): Promise<Record<string, unknown>> => {
  console.log("toto");
  // @ts-expect-error

  return await NAME_TO_ENTITY_MAPPING[process.env.entityName].query(payload);
};

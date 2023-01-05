import { TestPutEntity } from "../../PutItemTest/dynamodb-toolbox";
import { TestUpdateEntity } from "../../UpdateItemTest/dynamodb-toolbox";
import { TestGetEntity } from "../../GetItemTest/dynamodb-toolbox";

const NAME_TO_ENTITY_MAPPING = {
  [TestPutEntity.name]: TestPutEntity,
  [TestUpdateEntity.name]: TestUpdateEntity,
  [TestGetEntity.name]: TestGetEntity,
};

export const main = async (
  payload: Record<string, unknown>
): Promise<Record<string, unknown>> =>
  // @ts-expect-error
  (await NAME_TO_ENTITY_MAPPING[process.env.entityName].get(payload)).Item;

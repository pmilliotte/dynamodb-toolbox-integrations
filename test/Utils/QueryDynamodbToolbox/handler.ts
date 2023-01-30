import { TestQueryEntity } from "../../QueryTest/dynamodb-toolbox";

const NAME_TO_ENTITY_MAPPING = {
  [TestQueryEntity.name]: TestQueryEntity,
};

export const main = async (
  payload: Record<string, unknown>
): Promise<Record<string, unknown>> => {
  if (process.env.entityName === undefined) {
    throw new Error("Env variable undefined");
  }
  return await NAME_TO_ENTITY_MAPPING[process.env.entityName].query(payload);
};

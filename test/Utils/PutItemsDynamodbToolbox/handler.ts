import { TestGetEntity } from "../../GetItemTest/dynamodb-toolbox";
import { TestPutEntity } from "../../PutItemTest/dynamodb-toolbox";
import { TestQueryEntity } from "../../QueryTest/dynamodb-toolbox";
import { TestUpdateEntity } from "../../UpdateItemTest/dynamodb-toolbox";

export const main = async (
  payload: Record<string, unknown>[]
): Promise<void> => {
  switch (process.env.entityName) {
    case TestPutEntity.name:
      // @ts-expect-error
      await Promise.all(payload.map((item) => TestPutEntity.put(item)));
      break;
    case TestUpdateEntity.name:
      // @ts-expect-error\
      await Promise.all(payload.map((item) => TestUpdateEntity.put(item)));
      break;
    case TestGetEntity.name:
      // @ts-expect-error
      await Promise.all(payload.map((item) => TestGetEntity.put(item)));
      break;
    case TestQueryEntity.name:
      // @ts-expect-error
      await Promise.all(payload.map((item) => TestQueryEntity.put(item)));
      break;
  }
};

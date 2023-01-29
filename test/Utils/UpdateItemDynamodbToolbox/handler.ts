import { TestPutEntity } from "../../PutItemTest/dynamodb-toolbox";
import { TestUpdateEntity } from "../../UpdateItemTest/dynamodb-toolbox";

export const main = async (payload: Record<string, unknown>): Promise<void> => {
  switch (process.env.entityName) {
    case TestPutEntity.name:
      // @ts-expect-error
      await TestPutEntity.update(payload);
    case TestUpdateEntity.name:
      // @ts-expect-error
      await TestUpdateEntity.update(payload);
  }
};

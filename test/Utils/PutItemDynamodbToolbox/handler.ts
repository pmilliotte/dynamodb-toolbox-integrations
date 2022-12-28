import { TestPutEntity } from "../../PutItemTest/dynamodb-toolbox";
import { TestUpdateEntity } from "../../UpdateItemTest/dynamodb-toolbox";

export const main = async (payload: Record<string, unknown>): Promise<void> => {
  switch (process.env.entityName) {
    case TestPutEntity.name:
      console.log("hello");
      // @ts-expect-error
      await TestPutEntity.put(payload);
    case TestUpdateEntity.name:
      // @ts-expect-error
      await TestUpdateEntity.put(payload);
  }
};

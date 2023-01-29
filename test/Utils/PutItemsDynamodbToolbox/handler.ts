import { TestQueryEntity } from "../../QueryTest/dynamodb-toolbox";

export const main = async (
  payload: Record<string, unknown>[]
): Promise<void> => {
  switch (process.env.entityName) {
    case TestQueryEntity.name:
      // @ts-expect-error
      await Promise.all(payload.map((item) => TestQueryEntity.put(item)));
      break;
  }
};

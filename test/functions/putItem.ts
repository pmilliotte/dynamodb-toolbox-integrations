import { v4 as uuidv4 } from "uuid";
import { TestEntity } from "../dynamodb-toolbox";

export const main = async ({ type }: { type: string }): Promise<string> => {
  const id = uuidv4();

  await TestEntity.put({
    type,
    id,
  });

  return id;
};

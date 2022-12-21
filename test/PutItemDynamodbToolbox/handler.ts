import { TestEntity } from "../dynamodb-toolbox";

export const main = async (entity: {
  name: string;
  type: string;
  age?: number;
  count?: number;
  length?: number;
  sentencePrefixed?: string;
  sentenceSuffixed?: string;
}): Promise<void> => {
  await TestEntity.put(entity);
};

import { v4 as uuidv4 } from "uuid";
import { TestEntity } from "../dynamodb-toolbox";

export const main = async ({
  type,
  id,
}: {
  type: string;
  id: string;
}): Promise<string> => {
  const { Item } = await TestEntity.get({
    type,
    id,
  });
  console.log("WOOOWOOOWOOWOOWOOWW");
  console.log("888888888888888888888888888888888888888888");
  console.log(Item);
  console.info("Item", Item);
  return Item?.id || "no item found";
};

import { ApiHandler } from "sst/node/api";
import { UserEntity } from "@hackathon-rugby-is-easy/core/entities";
import { PutItemCommand } from "dynamodb-toolbox";
import { randomUUID } from "crypto";
import { Table } from "sst/node/table";
const mockUser = {
  userId: "123",
  username: "test",
  userEmail: "user@test.com",
};

export const create = ApiHandler(async (_evt) => {
  const createdUser = await UserEntity.build(PutItemCommand)
    .item({
      userId: randomUUID(),
      username: "UsernameTest" + randomUUID(),
    })
    .send();

  return {
    statusCode: 200,
    body: JSON.stringify(createdUser),
  };
});

import { ApiHandler } from "sst/node/api";
import { UserEntity } from "@hackathon-rugby-is-easy/core/entities";
import { PostUserInput } from "@hackathon-rugby-is-easy/core/types";
import { PutItemCommand } from "dynamodb-toolbox";
import { randomUUID } from "crypto";

export const create = ApiHandler(async (_evt) => {
  const stringBody = _evt.body as string;
  const postUserInput = JSON.parse(stringBody) as PostUserInput;

  const sessionId = randomUUID();
  const userId = randomUUID();

  const createdUser = {
    userId,
    sessionId,
    username: postUserInput.username,
    userEmail: postUserInput.userEmail,
  };

  await UserEntity.build(PutItemCommand).item(createdUser).send();

  return {
    statusCode: 200,
    body: JSON.stringify(createdUser),
  };
});

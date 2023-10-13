import { UserEntity } from "@hackathon-rugby-is-easy/core/entities";
import { PostUserInput } from "@hackathon-rugby-is-easy/core/types";
import { randomUUID } from "crypto";
import { PutItemCommand } from "dynamodb-toolbox";
import { ApiHandler } from "sst/node/api";

export const create = ApiHandler(async (_evt) => {
  const stringBody = _evt.body as string;
  const postUserInput = JSON.parse(stringBody) as PostUserInput;

  const sessionId = randomUUID();
  const userId = postUserInput.username;

  const createdUser = {
    userId,
    sessionId,
    username: postUserInput.username,
    userEmail: postUserInput.userEmail,
  };

  try {
    await UserEntity.build(PutItemCommand)
      .item(createdUser)
      .options({
        condition: {
          attr: "username",
          exists: false,
        },
      })
      .send();
  } catch (e: any) {
    if (e.name === "ConditionalCheckFailedException") {
      return {
        statusCode: 400,
        body: JSON.stringify("User already exists"),
      };
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(createdUser),
  };
});

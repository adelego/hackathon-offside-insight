import {
  QuestionEntity,
  UserEntity,
} from "@hackathon-rugby-is-easy/core/entities";
import { PostQuestionInput } from "@hackathon-rugby-is-easy/core/types";
import { randomUUID } from "crypto";
import { GetItemCommand, PutItemCommand } from "dynamodb-toolbox";
import { ApiHandler } from "sst/node/api";

export const create = ApiHandler(async (_evt) => {
  const stringBody = _evt.body as string;
  const postUserInput = JSON.parse(stringBody) as PostQuestionInput;

  const username = postUserInput.username;

  const { Item: user } = await UserEntity.build(GetItemCommand)
    .key({ username })
    .send();

  if (user === undefined) {
    return {
      statusCode: 400,
      body: JSON.stringify(`User ${username} does not exist`),
    };
  }

  const questionId = randomUUID();

  const createdQuestion = {
    username,
    questionId,
  };

  try {
    await QuestionEntity.build(PutItemCommand).item(createdQuestion).send();
  } catch (e: any) {
    throw e;
  }

  console.log(createdQuestion);

  return {
    statusCode: 200,
    body: JSON.stringify(createdQuestion),
  };
});

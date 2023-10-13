import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import {
  QuestionEntity,
  UserEntity,
} from "@hackathon-rugby-is-easy/core/entities";
import {
  GetQuestionOutput,
  ListUserQuestionsOutput,
  PostQuestionInput,
  PostQuestionOutput,
} from "@hackathon-rugby-is-easy/core/types";
import { randomUUID } from "crypto";
import { GetItemCommand, PutItemCommand } from "dynamodb-toolbox";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";

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
    ...postUserInput,
    notified: false,
    questionId,
  };

  try {
    await QuestionEntity.build(PutItemCommand).item(createdQuestion).send();
  } catch (e: any) {
    throw e;
  }

  const reponse: PostQuestionOutput = createdQuestion;

  return {
    statusCode: 200,
    body: JSON.stringify(reponse),
  };
});

export const get = ApiHandler(async (_evt) => {
  const { questionId } = _evt.pathParameters as { questionId: string };

  const { Item: question } = await QuestionEntity.build(GetItemCommand)
    .key({ questionId })
    .send();

  if (question === undefined) {
    return {
      statusCode: 400,
      body: JSON.stringify(`Question ${questionId} not found`),
    };
  }

  const reponse: GetQuestionOutput = question;

  return {
    statusCode: 200,
    body: JSON.stringify(reponse),
  };
});

const dynamodbClient = new DynamoDBClient({});

export const list = ApiHandler(async (_evt) => {
  const { username } = _evt.pathParameters as { username: string };

  const command = new QueryCommand({
    IndexName: "GSI1",
    TableName: Table.Table.tableName,
    ExpressionAttributeValues: {
      ":pk": { S: "Question" },
      ":sk": { S: username },
    },
    KeyConditionExpression: "GSI1_PK = :pk AND GSI1_SK = :sk",
  });

  const { Items: questions = [] } = await dynamodbClient.send(command);

  const response: ListUserQuestionsOutput = { questions };

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
});

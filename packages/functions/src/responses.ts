import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import {
  QuestionEntity,
  ResponseEntity,
} from "@hackathon-rugby-is-easy/core/entities";
import {
  ListQuestionResponsesOutput,
  PostResponseInput,
  PostResponseOutput,
} from "@hackathon-rugby-is-easy/core/types";
import { randomUUID } from "crypto";
import { GetItemCommand, PutItemCommand } from "dynamodb-toolbox";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";

export const create = ApiHandler(async (_evt) => {
  const stringBody = _evt.body as string;
  const postResponseInput = JSON.parse(stringBody) as PostResponseInput;

  const { questionId } = postResponseInput;

  const { Item: question } = await QuestionEntity.build(GetItemCommand)
    .key({
      questionId,
    })
    .send();

  if (question === undefined) {
    return {
      statusCode: 400,
      body: JSON.stringify(`Question ${questionId} does not exist`),
    };
  }

  const responseId = randomUUID();

  const createdResponse = {
    ...postResponseInput,
    responseId,
  };

  try {
    await ResponseEntity.build(PutItemCommand).item(createdResponse).send();
  } catch (e: any) {
    // todo implement error handling
    throw e;
  }

  const response: PostResponseOutput = createdResponse;

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
});

const dynamodbClient = new DynamoDBClient({});

export const list = ApiHandler(async (_evt) => {
  const { questionId } = _evt.pathParameters as { questionId: string };

  const command = new QueryCommand({
    IndexName: "GSI1",
    TableName: Table.Table.tableName,
    ExpressionAttributeValues: {
      ":pk": { S: "Response" },
      ":sk": { S: questionId },
    },
    KeyConditionExpression: "GSI1_PK = :pk AND GSI1_SK = :sk",
  });

  const { Items: responses = [] } = await dynamodbClient.send(command);

  const response: ListQuestionResponsesOutput = { responses };

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
});

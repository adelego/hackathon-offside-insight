import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { UserEntity } from "@hackathon-rugby-is-easy/core/entities";
import {
  PostUserInput,
  PostUserOutput,
  UsersLeaderboardOutput,
} from "@hackathon-rugby-is-easy/core/types";
import { randomUUID } from "crypto";
import { PutItemCommand } from "dynamodb-toolbox";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";

export const create = ApiHandler(async (_evt) => {
  const stringBody = _evt.body as string;
  const postUserInput = JSON.parse(stringBody) as PostUserInput;

  const sessionId = randomUUID();
  const userId = postUserInput.username;

  const createdUser = {
    sessionId,
    username: postUserInput.username,
    userEmail: postUserInput.userEmail,
  };

  try {
    await UserEntity.build(PutItemCommand)
      .item({
        ...createdUser,
        score: 0,
      })
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
    throw e;
  }

  const response: PostUserOutput = createdUser;

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
});

const dynamodbClient = new DynamoDBClient({});

export const leaderboard = ApiHandler(async (_evt) => {
  const command = new QueryCommand({
    TableName: Table.Table.tableName,
    ExpressionAttributeValues: {
      ":pk": { S: "User" },
    },
    KeyConditionExpression: "PK = :pk",
  });

  const { Items: users = [] } = await dynamodbClient.send(command);

  const response: UsersLeaderboardOutput = {
    users: users.map((user) => ({
      username: user.SK.S ?? '',
      score: +(user.score.N ?? '0'),
    })),
  }

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
});
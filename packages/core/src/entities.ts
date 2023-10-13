import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { EntityV2, boolean, map, number, schema, string } from "dynamodb-toolbox";

import { TableV2 } from "dynamodb-toolbox";
import { Table } from "sst/node/table";

const dynamoDBClient = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(dynamoDBClient);

const table = new TableV2({
  name: Table.Table.tableName,
  partitionKey: {
    name: "PK",
    type: "string",
  },
  sortKey: {
    name: "SK",
    type: "string",
  },
  documentClient,
});

export const UserEntity = new EntityV2({
  name: "User",
  table,
  schema: schema({
    PK: string().key().default("User"),
    username: string().key().savedAs("SK"),
    sessionId: string().required(),
    userEmail: string().optional(),
  }),
});

export const QuestionEntity = new EntityV2({
  name: "Question",
  table,
  schema: schema({
    PK: string().key().default("Question"),
    questionId: string().key().savedAs("SK"),
    GSI1_PK: string().default("Question"),
    username: string().required().savedAs("GSI1_SK"),
    questionText: string().required(),
    questionTimestamp: string().optional(),
    matchDetails: map({
      team1: string().required(),
      team2: string().required(),
      date: string().required(),
    }).required(),
    notified: boolean().required(),
  }),
});

export const ResponseEntity = new EntityV2({
  name: "Response",
  table,
  schema: schema({
    PK: string().key().default("Response"),
    responseId: string().key().savedAs("SK"),
    GSI1_PK: string().default("Response"),
    questionId: string().required().savedAs("GSI1_SK"),
    responseText: string().required(),
    upvotes: number().default(0),
    downvotes: number().default(0),
  }),
});

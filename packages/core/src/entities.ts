import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { EntityV2, schema, string } from "dynamodb-toolbox";

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
    userId: string().key().savedAs("SK"),
    sessionId: string().required(),
    username: string().required(),
    userEmail: string().optional(),
  }),
});

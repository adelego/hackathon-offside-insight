import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { EntityV2, schema, string } from "dynamodb-toolbox";

import { TableV2 } from "dynamodb-toolbox";

const dynamoDBClient = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(dynamoDBClient);

const table = new TableV2({
  name: () => process.env.TABLE_NAME ?? "",
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
    PK: string().key(),
    SK: string().key(),
    userId: string().required(),
    username: string().required(),
    userEmail: string().optional(),
  }),
});

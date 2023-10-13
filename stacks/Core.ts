import {
  StackContext,
  Api,
  EventBus,
  StaticSite,
  Table,
  Function,
  Bucket,
} from "sst/constructs";
import { BillingMode } from "aws-cdk-lib/aws-dynamodb";
import { StartingPosition } from "aws-cdk-lib/aws-lambda";

const PK = "PK";
const SK = "SK";

const GSI1_PK = "GSI1_PK";
const GSI1_SK = "GSI1_SK";

export function Core({ stack }: StackContext) {
  const bus = new EventBus(stack, "bus", {
    defaults: {
      retries: 10,
    },
  });

  const mediaBucket = new Bucket(stack, "MediaBucket");

  const table = new Table(stack, "Table", {
    fields: {
      [PK]: "string",
      [SK]: "string",
      [GSI1_PK]: "string",
      [GSI1_SK]: "string",
    },
    primaryIndex: {
      partitionKey: PK,
      sortKey: SK,
    },
    globalIndexes: {
      GSI1: {
        partitionKey: GSI1_PK,
        sortKey: GSI1_SK,
      },
    },
    cdk: {
      table: {
        billingMode: BillingMode.PAY_PER_REQUEST,
      },
    },
    stream: "new_and_old_images",
  });

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [bus, table, mediaBucket],
      },
    },
    routes: {
      "POST /users": "packages/functions/src/users.create",
      "POST /questions": "packages/functions/src/questions.create",
      "GET /questions/{username}": "packages/functions/src/questions.list",
      "POST /responses": "packages/functions/src/responses.create",
      "GET /responses/{questionId}":
        "packages/functions/src/responses.listForQuestion",
      "POST /medias/upload-url": "packages/functions/src/medias.getUploadUrl",
    },
  });

  const site = new StaticSite(stack, "ReactSite", {
    path: "packages/frontend",
    buildCommand: "pnpm run build",
    buildOutput: "build",
    environment: {
      REACT_APP_API_URL: api.url,
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    SiteUrl: site.url,
  });

  const fanout = new Function(stack, "Fanout", {
    handler: "packages/functions/src/fanout.handler",
    environment: {
      TABLE_NAME: table.tableName,
    },
  });

  table.cdk.table.grantStreamRead(fanout);

  fanout.addEventSourceMapping("EventSourceMapping", {
    eventSourceArn: table.cdk.table.tableStreamArn,
    startingPosition: StartingPosition.LATEST,
    batchSize: 1,
  });

  fanout.bind([bus]);

  bus.subscribe("response.updated", {
    handler: "packages/functions/src/onResponseUpdated.handler",
  });
}

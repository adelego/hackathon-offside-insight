import { StackContext, Api, EventBus, StaticSite, Table } from "sst/constructs";
import { BillingMode } from "aws-cdk-lib/aws-dynamodb";

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
  });

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [bus, table],
      },
    },
    routes: {
      "POST /users": "packages/functions/src/users.create",
      "POST /questions": "packages/functions/src/questions.create",
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
}

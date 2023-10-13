import { StackContext, Api, EventBus, StaticSite, Table } from "sst/constructs";
import { BillingMode } from 'aws-cdk-lib/aws-dynamodb';

const PK = 'PK';
const SK = 'SK';

const GSI1_PK = 'GSI1_PK';
const GSI1_SK = 'GSI1_SK';

export function API({ stack }: StackContext) {
  const bus = new EventBus(stack, "bus", {
    defaults: {
      retries: 10,
    },
  });

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [bus],
      },
    },
    routes: {
      "GET /": "packages/functions/src/lambda.handler",
      "GET /todo": "packages/functions/src/todo.list",
      "POST /todo": "packages/functions/src/todo.create",
    },
  });

  const site = new StaticSite(stack, "ReactSite", {
    path: "packages/frontend",
    buildCommand: "npm run build",
    buildOutput: "build",
    environment: {
      REACT_APP_API_URL: api.url,
    },
  });

  bus.subscribe("todo.created", {
    handler: "packages/functions/src/events/todo-created.handler",
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    SiteUrl: site.url,
  });

  new Table(stack, "Table", {
    fields: {
      [PK]: 'string',
      [SK]: 'string',
      [GSI1_PK]: 'string',
      [GSI1_SK]: 'string',
    },
    primaryIndex: {
      partitionKey: PK,
      sortKey: SK,
    },
    globalIndexes: {
      GSI1: {
        partitionKey: GSI1_PK,
        sortKey: GSI1_SK,
      }
    },
    cdk: {
      table: {
        billingMode: BillingMode.PAY_PER_REQUEST,
      }
    }
  });
}

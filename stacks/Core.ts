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

import { HostedZone } from "aws-cdk-lib/aws-route53";

import { CfnTemplate, EmailIdentity, Identity } from "aws-cdk-lib/aws-ses";

import { responseEmailHtml } from "./responseEmailHtml";
import {
  Effect,
  PolicyDocument,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";

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
    cors: {
      allowOrigins: ["*"],
    },
    routes: {
      "POST /users": "packages/functions/src/users.create",
      "POST /questions": "packages/functions/src/questions.create",
      "GET /questions/{username}": "packages/functions/src/questions.list",
      "GET /question/{questionId}": "packages/functions/src/questions.get",
      "POST /responses": "packages/functions/src/responses.create",
      "GET /responses/{questionId}": "packages/functions/src/responses.list",
      "POST /medias/upload-url": "packages/functions/src/medias.getUploadUrl",
      "GET /users/leaderboard": "packages/functions/src/users.leaderboard",
      "POST /responses/{responseId}/upvote": "packages/functions/src/responses.upvote",
      "POST /responses/{responseId}/downvote": "packages/functions/src/responses.downvote",
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

  const template = new CfnTemplate(stack, "Template", {
    template: {
      subjectPart: "Someone answered your question!",
      htmlPart: responseEmailHtml,
    },
  });

  const onResponseUpdatedRole = new Role(stack, "OnResponseUpdatedRole", {
    managedPolicies: [
      {
        managedPolicyArn:
          "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
      },
      {
        managedPolicyArn: "arn:aws:iam::aws:policy/AmazonSESFullAccess",
      },
    ],
    inlinePolicies: {
      ses: new PolicyDocument({
        statements: [
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ["ses:SendTemplatedEmail"],
            resources: ["*"],
          }),
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ["dynamodb:GetItem"],
            resources: [table.tableArn],
          }),
        ],
      }),
    },
    assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
  });

  bus.subscribe("response.updated", {
    environment: {
      TEMPLATE_NAME: template.ref,
      FRONT_URL: site.url ?? "",
    },
    handler: "packages/functions/src/onResponseUpdated.handler",
    role: onResponseUpdatedRole,
    bind: [table],
  });

  const hostedZone = HostedZone.fromHostedZoneAttributes(stack, "HostedZone", {
    hostedZoneId: "Z02701841Z0KRITFTM9EJ",
    zoneName: "rugby.pchol.fr",
  });
}

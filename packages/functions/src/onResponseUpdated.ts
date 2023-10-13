import { EventHandler } from "sst/node/event-bus";
import { Events } from "@hackathon-rugby-is-easy/core/events";
import { QuestionEntity, ResponseEntity, UserEntity } from "@hackathon-rugby-is-easy/core/entities";
import { GetItemCommand, UpdateItemCommand } from "dynamodb-toolbox";
import { SESClient, SendTemplatedEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({});

export const handler = EventHandler(Events.ResponseUpdated, async (evt) => {
  const responseId = evt.properties.responseId;

  const { Item: responseItem } = await ResponseEntity.build(GetItemCommand).key({ responseId: responseId }).send();

  if (responseItem === undefined) {
    throw new Error(`Response not found: ${responseId}`);
  }

  if (responseItem.upvotes - responseItem.downvotes < 10) {
    return;
  }

  const { Item: questionItem } = await QuestionEntity.build(GetItemCommand).key({ questionId: responseItem.questionId }).send();

  if (questionItem === undefined) {
    throw new Error(`Question not found: ${responseItem.questionId}`);
  }

  const { username, questionText, notified } = questionItem;

  if (notified === true) {
    return;
  }

  const { Item: userItem } = await UserEntity.build(GetItemCommand).key({ username }).send();

  if (userItem === undefined) {
    throw new Error(`User not found: ${username}`);
  }

  const { userEmail } = userItem;

  if (userEmail === undefined) {
    return;
  }

  await Promise.all([sesClient.send(new SendTemplatedEmailCommand({
    Source: 'notifications@rugby.pchol.fr',
    Destination: {
      ToAddresses: [userEmail]
    },
    Template: process.env.TEMPLATE_NAME,
    TemplateData: JSON.stringify({
      username,
      questionText,
      frontUrl: process.env.FRONT_URL,
    }),
  })), QuestionEntity.build(UpdateItemCommand).item({ notified: true, questionId: questionItem.questionId }).send()]);
});
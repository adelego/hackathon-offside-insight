import { createEventBuilder } from 'sst/node/event-bus';
import * as z from "zod";

export const event = createEventBuilder({
  bus: 'bus',
});

export const Events = {
  ResponseUpdated: event("response.updated", {
    responseId: z.string(),
    upvotes: z.number(),
    previousUpvotes: z.number(),
    downvotes: z.number(),
    previousDownvotes: z.number(),
  }),
};
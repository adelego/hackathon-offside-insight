import { createEventBuilder } from 'sst/node/event-bus';
import * as z from "zod";

export const event = createEventBuilder({
  bus: 'bus',
});

export const Events = {
  ResponseUpdated: event("response.updated", {
    id: z.string(),
  }),
};
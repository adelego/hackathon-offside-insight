import { EventHandler } from "sst/node/event-bus";
import { Events } from "@hackathon-rugby-is-easy/core/events";

export const handler = EventHandler(Events.ResponseUpdated, async (evt) => {
  console.log("Todo created", evt);
  console.log('aa')
});
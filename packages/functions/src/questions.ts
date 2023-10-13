import { ApiHandler } from "sst/node/api";

export const create = ApiHandler(async (_evt) => {
  return {
    statusCode: 200,
    body: JSON.stringify("coucou"),
  };
});

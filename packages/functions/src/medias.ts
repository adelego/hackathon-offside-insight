import { ApiHandler } from "sst/node/api";

const s3 = new S3Client({});

export const getUploadUrl = ApiHandler(async (_evt) => {
  return {
    statusCode: 200,
    body: JSON.stringify("ok"),
  };
});

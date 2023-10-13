import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { PostMediaInput } from "@hackathon-rugby-is-easy/core/types";
import { ApiHandler } from "sst/node/api";
import { Bucket } from "sst/node/bucket";
import { randomUUID } from "crypto";

const s3 = new S3Client({});
const bucketName = Bucket.MediaBucket.bucketName;

export const getUploadUrl = ApiHandler(async (_evt) => {
  const stringBody = _evt.body as string;
  const { mediaType } = JSON.parse(stringBody) as PostMediaInput;

  const mediaId = randomUUID();

  const fileName = `${mediaId}.${mediaType}`;

  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uploadUrl, fileName }),
    };
  } catch (error) {
    console.error("Error creating signed URL", error);

    throw error;
  }
});

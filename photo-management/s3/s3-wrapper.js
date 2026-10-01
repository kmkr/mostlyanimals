import { S3Client } from "@aws-sdk/client-s3";
import { BUCKET } from "../../photo-config.js";

export const s3 = new S3Client({});

export function generateParams(opts) {
  return {
    Bucket: BUCKET,
    ...opts,
  };
}

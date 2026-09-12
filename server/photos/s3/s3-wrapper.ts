import AWS from "aws-sdk";
import { BUCKET } from "../constants";

export const s3 = new AWS.S3({
  signatureVersion: "v4",
});

export function generateParams<T extends Record<string, unknown>>(
  opts: T
): T & { Bucket: string } {
  return {
    Bucket: BUCKET,
    ...opts,
  }
};

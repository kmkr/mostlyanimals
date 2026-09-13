import AWS from "aws-sdk";
import { BUCKET } from "../constants.js";

export const s3 = new AWS.S3({
  signatureVersion: "v4",
});

export function generateParams(opts) {
  return {
    Bucket: BUCKET,
    ...opts,
  };
}

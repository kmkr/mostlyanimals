import { s3, generateParams } from "./s3-wrapper";
import type AWS from "aws-sdk";

export function listItems(prefix: string): Promise<AWS.S3.ObjectList> {
  return new Promise((resolve, reject) => {
    console.log("[s3-lister] Fetching items with prefix %s", prefix);
    return s3.listObjects(
      generateParams({
        Prefix: prefix,
      }),
      (err, data) => {
        if (err) {
          return reject(err);
        }
        if (data.IsTruncated) {
          return reject(
            new Error(
              "s3-lister is not implemented to handle truncated results!"
            )
          );
        }
        return resolve(data.Contents || []);
      }
    );
  });
}

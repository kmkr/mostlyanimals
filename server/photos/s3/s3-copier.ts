import { s3, generateParams } from "./s3-wrapper";
import type AWS from "aws-sdk";

const oneYear = 60 * 60 * 24 * 365;
export function copyPhoto(
  from: string,
  to: string
): Promise<AWS.S3.CopyObjectOutput> {
  return new Promise((resolve, reject) => {
    console.log("[s3-copier] Copying %s to %s", from, to);

    s3.copyObject(
      generateParams({
        CopySource: from,
        Key: to,
        ACL: "public-read",
        CacheControl: `public, max-age=${oneYear}`,
        ContentType: "image/jpeg",
        Expires: new Date(2100, 1),
      }),
      (err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve(data);
      }
    );
  });
}

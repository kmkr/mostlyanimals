import {
  CopyObjectCommand,
  type CopyObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { s3, generateParams } from "./s3-wrapper";

const oneYear = 60 * 60 * 24 * 365;
export async function copyPhoto(
  from: string,
  to: string
): Promise<CopyObjectCommandOutput> {
  console.log("[s3-copier] Copying %s to %s", from, to);
  return s3.send(
    new CopyObjectCommand(
      generateParams({
        CopySource: from,
        Key: to,
        ACL: "public-read",
        CacheControl: `public, max-age=${oneYear}`,
        ContentType: "image/jpeg",
        Expires: new Date(2100, 1),
      })
    )
  );
}

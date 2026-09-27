import { ListObjectsCommand } from "@aws-sdk/client-s3";
import { s3, generateParams } from "./s3-wrapper.js";

export async function listItems(prefix) {
  console.log("[s3-lister] Fetching items with prefix %s", prefix);
  const data = await s3.send(
    new ListObjectsCommand(
      generateParams({
        Prefix: prefix,
      })
    )
  );

  if (data.IsTruncated) {
    throw new Error(
      "s3-lister is not implemented to handle truncated results!"
    );
  }
  return data.Contents || [];
}

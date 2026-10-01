import {
  DeleteObjectsCommand,
  type DeleteObjectsCommandOutput,
} from "@aws-sdk/client-s3";
import { s3, generateParams } from "./s3-wrapper";

import { listItems } from "./s3-lister";
import { resizeTo } from "../../photo-config";

function expectNumberOfKeys() {
  const numOriginalUpload = 0;

  return resizeTo.length + numOriginalUpload;
}

export async function deletePhoto(
  key: string
): Promise<DeleteObjectsCommandOutput> {
  const data = await listItems(key);
  if (data.length > expectNumberOfKeys() + 1) {
    throw new Error(
      `Expected ${expectNumberOfKeys()} keys with prefix ${key}, but found ${
        data.length
      }. Aborting deletion`,
    );
  }

  const keys = data
    .filter((elem): elem is typeof elem & { Key: string } => Boolean(elem.Key))
    .map((elem) => ({
      Key: elem.Key,
    }));

  console.log("[s3-deleter] Deleting %s keys", keys.length);

  return s3.send(
    new DeleteObjectsCommand(
      generateParams({
        Delete: {
          Objects: keys,
        },
      }),
    ),
  );
}

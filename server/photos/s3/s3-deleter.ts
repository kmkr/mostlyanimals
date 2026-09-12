import { s3, generateParams } from "./s3-wrapper";

import { listItems } from "./s3-lister";
import { resizeTo } from "../constants";

function expectNumberOfKeys() {
  const numOriginalUpload = 0;

  return resizeTo.length + numOriginalUpload;
}

export function deletePhoto(key: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    return listItems(key).then((data) => {
      if (data.length > expectNumberOfKeys() + 1) {
        return reject(
          new Error(
            `Expected ${expectNumberOfKeys()} keys with prefix ${key}, but found ${
              data.length
            }. Aborting deletion`,
          ),
        );
      }

      const keys = data
        .filter((elem): elem is typeof elem & { Key: string } =>
          Boolean(elem.Key)
        )
        .map((elem) => ({
          Key: elem.Key,
        }));

      console.log("[s3-deleter] Deleting %s keys", keys.length);

      s3.deleteObjects(
        generateParams({
          Delete: {
            Objects: keys,
          },
        }),
        (err, data) => {
          if (err) {
            return reject(err);
          }

          return resolve(data);
        },
      );
    });
  });
}

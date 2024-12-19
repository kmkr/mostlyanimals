const { BUCKET, resizeTo } = require("../server/photos/constants");
const { copyPhoto } = require("../server/photos/s3/s3-copier");
const { listItems } = require("../server/photos/s3/s3-lister");
const updatePhotoHandler = require("../server/photos/update/index");
const db = require("../server/db/index");

const regexp = /\/(\w{1,5})_.*\.jpg/;

(async () => {
  const photos = await db.list("photos");

  await Promise.all(
    photos.map(async (localPhotoEntry) => {
      // copy all
      const { key } = localPhotoEntry;
      const s3Files = await listItems(key);

      return s3Files
        .filter((f) => !f.Key.includes("mostlyanimals"))
        .map((s3File) => {
          const { Key: s3Key } = s3File;

          const newS3Key = s3Key.replace(
            regexp,
            `/mostlyanimals_${key}_$1.jpg`
          );
          console.log(`Copy ${s3Key} to ${newS3Key}`);
          copyPhoto(`${BUCKET}/${s3Key}`, newS3Key);

          const shortNameResize = s3Key.match(regexp)[1];
          console.log(shortNameResize);

          const longNameResize = resizeTo.find(
            (r) => r.shortName === shortNameResize
          ).name;

          console.log(localPhotoEntry);
          localPhotoEntry.resize[longNameResize].path = newS3Key;
          console.log(
            `Updating local photo resize ${longNameResize} with path ${newS3Key}`
          );
          return updatePhotoHandler(localPhotoEntry.key, localPhotoEntry);
        });
    })
  );

  process.exit();
})();

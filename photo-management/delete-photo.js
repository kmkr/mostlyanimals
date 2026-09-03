const fs = require("fs");
const path = require("path");
const minimist = require("minimist");
const deletePhotoHandler = require("../server/photos/delete/index");

const CONTENT_FILE_PATH = path.resolve(__dirname, "../content.json");

const argv = minimist(process.argv.slice(2));
const keys = argv["_"];
const skipS3 = argv["skip-s3"];

if (!keys || keys.length === 0) {
  console.error("Usage: node photo-management/delete-photo.js <key1> <key2> ... [--skip-s3]");
  process.exit(1);
}

(async () => {
  const content = JSON.parse(fs.readFileSync(CONTENT_FILE_PATH, "utf8"));
  let updatedContent = [...content];

  for (const key of keys) {
    if (!skipS3) {
      console.log(`Deleting photo ${key} from S3...`);
      try {
        await deletePhotoHandler(key);
        console.log(`Deleted photo ${key} from S3.`);
      } catch (err) {
        console.error(`Failed to delete photo ${key} from S3:`, err.message);
      }
    }

    const beforeLen = updatedContent.length;
    updatedContent = updatedContent.filter((p) => p.key !== key);
    if (updatedContent.length === beforeLen) {
      console.warn(`Photo with key ${key} not found in content.json.`);
    } else {
      console.log(`Removed photo ${key} from content.json.`);
    }
  }

  fs.writeFileSync(CONTENT_FILE_PATH, JSON.stringify(updatedContent, null, 2));
  console.log("content.json updated.");
  process.exit(0);
})();

const fs = require("fs");
const path = require("path");
const minimist = require("minimist");

const idGenerator = require("./id-generator");
const s3Uploader = require("../../server/photos/s3/s3-uploader");
const { resize, metadata: getMetadata } = require("./gm");
const tempFileWriter = require("./temp-file-writer");
const { resizeTo } = require("../../server/photos/constants");

function resizeToMultiple(path) {
  return resizeTo.map((r) => resize(path, r.width, r.name));
}

function getShortNameFromName(name) {
  return resizeTo.find((r) => r.name === name).shortName;
}

function generateFilePath(id, extension, resizeKey) {
  return `${id}/mostlyanimals_${id}_${resizeKey}${extension}`;
}

function withTs(filePath) {
  const ts = new Date().getTime();
  return `${filePath}?ts=${ts}`;
}

function upload(id, file, resizedResults) {
  const mimetype = file.mimetype;

  function upl(resizeKey, buffer) {
    const extension = path.parse(file.originalname).ext;
    const fileNameWithPath = generateFilePath(id, extension, resizeKey);
    return s3Uploader(buffer, fileNameWithPath, mimetype);
  }

  return resizeTo.map((r, index) =>
    upl(r.shortName, resizedResults[index].buffer)
  );
}

async function processAndUploadFile(filePath, id) {
  const buffer = fs.readFileSync(filePath);
  const file = {
    buffer,
    originalname: path.parse(filePath).base,
    mimetype: "image/jpeg", // Watch out!
  };
  const fileExtension = path.parse(filePath).ext;
  let tempFilePath;
  const resizedResults = await tempFileWriter(file).then(({ path }) => {
    tempFilePath = path;
    return Promise.all(resizeToMultiple(tempFilePath));
  });
  await Promise.all(upload(id, file, resizedResults));

  const resize = resizedResults
    .map(({ sizeLabel, width, height }) => ({
      sizeLabel,
      width,
      height,
    }))
    .reduce((prevVal, nextVal) => {
      prevVal[nextVal.sizeLabel] = {
        height: nextVal.height,
        width: nextVal.width,
        path: withTs(
          generateFilePath(
            id,
            fileExtension,
            getShortNameFromName(nextVal.sizeLabel)
          )
        ),
      };

      return prevVal;
    }, {});

  const metadata = await getMetadata(tempFilePath).then((md) => ({
    resize,
    ...md,
  }));

  return {
    key: id,
    name: file.originalname,
    ...metadata,
  };
}

const CONTENT_FILE_PATH = path.resolve(__dirname, "../../content.json");

function replaceKeyInContentJson(id, photo) {
  const rawContent = fs.readFileSync(CONTENT_FILE_PATH, "utf8");
  const localPhotoContent = JSON.parse(rawContent);

  const index = localPhotoContent.findIndex((p) => p.key === id);
  if (index === -1) {
    throw new Error(`Photo with key ${id} not found in content.json`);
  }

  localPhotoContent[index] = {
    ...localPhotoContent[index],
    name: photo.name,
    width: photo.width,
    height: photo.height,
    resize: photo.resize,
    ...(photo.description ? { description: photo.description } : {}),
  };

  fs.writeFileSync(
    CONTENT_FILE_PATH,
    JSON.stringify(localPhotoContent, null, 2)
  );
  console.log(`Updated content.json for replaced photo ${id}`);
}

async function replaceKeyWithFile(id, filePath) {
  console.log("Processing", filePath);
  const photo = await processAndUploadFile(filePath, id);
  console.log("Replacing photo %o with %s", photo, filePath);
  replaceKeyInContentJson(id, photo);
  console.log("Processing complete");
}

function updateContentJson(newPhotos) {
  if (!newPhotos || newPhotos.length === 0) {
    return;
  }

  const rawContent = fs.readFileSync(CONTENT_FILE_PATH, "utf8");
  const localPhotoContent = JSON.parse(rawContent);

  const newEntries = newPhotos.map((photo) => ({
    key: photo.key,
    name: photo.name,
    title: "",
    description: photo.description || "",
    location: "",
    tags: [],
    width: photo.width,
    height: photo.height,
    resize: photo.resize,
  }));

  const updatedContent = [...newEntries, ...localPhotoContent];

  fs.writeFileSync(CONTENT_FILE_PATH, JSON.stringify(updatedContent, null, 2));
  console.log(`Updated content.json with ${newPhotos.length} new photo(s)`);
}

async function insertFileWithKey(id, filePath) {
  console.log("Processing", filePath);
  const photo = await processAndUploadFile(filePath, id);
  console.log("Uploaded photo %o", photo);
  console.log("Processing complete");
  return photo;
}

(async function () {
  const argv = minimist(process.argv.slice(2));

  const replaceKey = argv["replace"];
  const filePaths = argv["_"];

  if (replaceKey) {
    if (filePaths.length !== 1) {
      throw new Error(
        `Unable to replace one key with more than file. Found ${filePaths.length} files`
      );
    }
    await replaceKeyWithFile(replaceKey, filePaths[0]);
  } else {
    const newPhotos = [];
    try {
      for (let filePath of filePaths) {
        const id = idGenerator.id();
        const photo = await insertFileWithKey(id, filePath);
        newPhotos.push(photo);
      }
    } finally {
      if (newPhotos.length > 0) {
        updateContentJson(newPhotos);
      }
    }
  }

  process.exit();
})();

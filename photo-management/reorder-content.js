const fs = require("fs");
const path = require("path");

const CONTENT_FILE_PATH = path.resolve(__dirname, "../content.json");
const PHOTOS_PER_ROW = 3;
const MAX_PORTRAIT_ROW_ADVANCE = 3;
const PORTRAIT_INDEX_ORDER = [0, 2, 1, 1, 0, 2];

function isPortrait(photo) {
  return photo.resize.small.height > photo.resize.small.width;
}

function reorderPhotos(photos) {
  const remainingLandscapes = photos.filter((photo) => !isPortrait(photo));
  const remainingPortraits = photos
    .map((photo, index) => ({
      originalRow: Math.floor(index / PHOTOS_PER_ROW),
      photo,
    }))
    .filter(({ photo }) => isPortrait(photo));
  const reorderedPhotos = [];
  let rowIndex = 0;
  let previousPortraitIndex = null;

  while (remainingLandscapes.length || remainingPortraits.length) {
    const row = [];
    let preferredPortraitIndex;

    for (let offset = 0; offset < PORTRAIT_INDEX_ORDER.length; offset += 1) {
      const candidate =
        PORTRAIT_INDEX_ORDER[
          (rowIndex + offset) % PORTRAIT_INDEX_ORDER.length
        ];
      if (candidate !== previousPortraitIndex) {
        preferredPortraitIndex = candidate;
        break;
      }
    }

    while (
      row.length < PHOTOS_PER_ROW &&
      (remainingLandscapes.length || remainingPortraits.length)
    ) {
      const portrait =
        row.length === preferredPortraitIndex &&
        remainingPortraits[0]?.originalRow <=
          rowIndex + MAX_PORTRAIT_ROW_ADVANCE
          ? remainingPortraits.shift().photo
          : null;
      const photo =
        row.length === preferredPortraitIndex && portrait
          ? portrait
          : remainingLandscapes.shift() || remainingPortraits.shift();

      if (!photo) {
        break;
      }

      row.push(photo.photo || photo);
    }

    reorderedPhotos.push(...row);
    const portraitIndex = row.findIndex(isPortrait);
    if (portraitIndex !== -1) {
      previousPortraitIndex = portraitIndex;
    }
    rowIndex += 1;
  }

  return reorderedPhotos;
}

const content = JSON.parse(fs.readFileSync(CONTENT_FILE_PATH, "utf8"));
const featured = content.filter((photo) => photo.featured);
const nonFeatured = content.filter((photo) => !photo.featured);
const reorderedContent = [
  ...reorderPhotos(featured),
  ...reorderPhotos(nonFeatured),
];

fs.writeFileSync(
  CONTENT_FILE_PATH,
  `${JSON.stringify(reorderedContent, null, 2)}\n`
);
console.log(`Reordered ${reorderedContent.length} photos in content.json.`);

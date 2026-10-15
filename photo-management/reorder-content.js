const fs = require("fs");
const path = require("path");

const CONTENT_FILE_PATH = path.resolve(__dirname, "../content.json");
const PHOTOS_PER_ROW = 3;
const MAX_PHOTO_SHIFT = PHOTOS_PER_ROW * 3;
const PORTRAIT_INDEX_ORDER = [0, 2, 1, 1, 0, 2];

function isPortrait(photo) {
  return photo.resize.small.height > photo.resize.small.width;
}

function validateSortIndices(photos) {
  const sortIndices = new Set();
  for (const photo of photos) {
    if (!Number.isFinite(photo.sortIndex)) {
      throw new Error(`Photo ${photo.key} has an invalid sortIndex`);
    }
    if (sortIndices.has(photo.sortIndex)) {
      throw new Error(`Duplicate sortIndex: ${photo.sortIndex}`);
    }
    sortIndices.add(photo.sortIndex);
  }
}

function sortBySortIndex(photos) {
  validateSortIndices(photos);
  return [...photos].sort((a, b) => b.sortIndex - a.sortIndex);
}

function movePhotoWithinShiftLimit(photos, fromIndex, toIndex, baselineIndex) {
  if (fromIndex === toIndex) {
    return true;
  }

  const reordered = [...photos];
  const [photo] = reordered.splice(fromIndex, 1);
  reordered.splice(toIndex, 0, photo);
  const firstChangedIndex = Math.min(fromIndex, toIndex);
  const lastChangedIndex = Math.max(fromIndex, toIndex);

  for (let index = firstChangedIndex; index <= lastChangedIndex; index += 1) {
    const originalIndex = baselineIndex.get(reordered[index].key);
    if (Math.abs(index - originalIndex) > MAX_PHOTO_SHIFT) {
      return false;
    }
  }

  photos.splice(0, photos.length, ...reordered);
  return true;
}

function getPreferredPortraitIndex(rowIndex, previousPortraitIndex) {
  for (let offset = 0; offset < PORTRAIT_INDEX_ORDER.length; offset += 1) {
    const candidate =
      PORTRAIT_INDEX_ORDER[(rowIndex + offset) % PORTRAIT_INDEX_ORDER.length];
    if (candidate !== previousPortraitIndex) {
      return candidate;
    }
  }
}

function reorderPhotos(photos) {
  const reorderedPhotos = sortBySortIndex(photos);
  const baselineIndex = new Map(
    reorderedPhotos.map((photo, index) => [photo.key, index])
  );
  let previousPortraitIndex = null;

  for (
    let rowStart = 0, rowIndex = 0;
    rowStart < reorderedPhotos.length;
    rowStart += PHOTOS_PER_ROW, rowIndex += 1
  ) {
    const preferredPortraitIndex = getPreferredPortraitIndex(
      rowIndex,
      previousPortraitIndex
    );
    const rowEnd = Math.min(rowStart + PHOTOS_PER_ROW, reorderedPhotos.length);
    const desiredIndex = Math.min(rowStart + preferredPortraitIndex, rowEnd - 1);
    let portraitIndex = reorderedPhotos.findIndex(
      (photo, index) =>
        index >= rowStart && index < rowEnd && isPortrait(photo)
    );

    if (portraitIndex === -1 && desiredIndex < rowEnd) {
      const lookaheadEnd = Math.min(
        rowStart + PHOTOS_PER_ROW + MAX_PHOTO_SHIFT,
        reorderedPhotos.length
      );
      portraitIndex = reorderedPhotos.findIndex(
        (photo, index) =>
          index >= rowEnd && index < lookaheadEnd && isPortrait(photo)
      );
      if (portraitIndex !== -1) {
        movePhotoWithinShiftLimit(
          reorderedPhotos,
          portraitIndex,
          desiredIndex,
          baselineIndex
        );
      }
    } else if (portraitIndex !== -1) {
      movePhotoWithinShiftLimit(
        reorderedPhotos,
        portraitIndex,
        desiredIndex,
        baselineIndex
      );
    }

    const updatedPortraitIndex = reorderedPhotos
      .slice(rowStart, rowEnd)
      .findIndex(isPortrait);
    if (updatedPortraitIndex !== -1) {
      previousPortraitIndex = updatedPortraitIndex;
    }
  }

  return reorderedPhotos;
}

function reorderContent(content) {
  validateSortIndices(content);
  const featured = content.filter((photo) => photo.featured);
  const nonFeatured = content.filter((photo) => !photo.featured);
  return [...reorderPhotos(featured), ...reorderPhotos(nonFeatured)];
}

if (require.main === module) {
  const content = JSON.parse(fs.readFileSync(CONTENT_FILE_PATH, "utf8"));
  const reorderedContent = reorderContent(content);

  fs.writeFileSync(
    CONTENT_FILE_PATH,
    `${JSON.stringify(reorderedContent, null, 2)}\n`
  );
  console.log(`Reordered ${reorderedContent.length} photos in content.json.`);
}

module.exports = {
  isPortrait,
  reorderPhotos,
  reorderContent,
  MAX_PHOTO_SHIFT,
};

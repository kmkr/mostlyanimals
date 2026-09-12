const MAX_VIEWPORT_WIDTH = 2560;
const PHOTO_GAP = 8;
const PORTRAIT_INDEX_ORDER = [0, 2, 1, 1, 0, 2];

/**
 * Returns the displayed image width-to-height ratio.
 */
function getAspectRatio(photo) {
  return photo.resize.small.width / photo.resize.small.height;
}

/**
 * Selects the target height used when deciding where a row ends.
 */
function getTargetRowHeight(viewportWidth) {
  if (viewportWidth > 1400) {
    return 450;
  }

  if (viewportWidth >= 1400) {
    return 600;
  }

  return 370;
}

/**
 * Identifies portrait photos from their source dimensions.
 */
function isPortrait(photo) {
  return photo.resize.small.height > photo.resize.small.width;
}

/**
 * Takes the next photo for a row, placing a portrait at its preferred index
 * when one is available and otherwise consuming a landscape photo.
 */
function getNextPhoto(
  remainingLandscapes,
  remainingPortraits,
  currentIndex,
  preferredPortraitIndex
) {
  if (currentIndex === preferredPortraitIndex && remainingPortraits.length) {
    return remainingPortraits.shift();
  }

  return remainingLandscapes.length
    ? remainingLandscapes.shift()
    : remainingPortraits.shift();
}

/**
 * Chooses a portrait index while avoiding the index used by the previous row.
 */
function getPreferredPortraitIndex(rowIndex, previousPortraitIndex) {
  for (let offset = 0; offset < PORTRAIT_INDEX_ORDER.length; offset++) {
    const preferredIndex =
      PORTRAIT_INDEX_ORDER[
        (rowIndex + offset) % PORTRAIT_INDEX_ORDER.length
      ];
    if (preferredIndex !== previousPortraitIndex) {
      return preferredIndex;
    }
  }

  return PORTRAIT_INDEX_ORDER[rowIndex % PORTRAIT_INDEX_ORDER.length];
}

/**
 * Groups photos into justified rows and adds a displayed width to each photo.
 *
 * Rows are ordered by viewport width, target height, and orientation. The
 * returned groups contain a key, row height, and laid-out photo objects.
 */
export default function setWidthHelper(_photos, viewportWidth) {
  const remainingLandscapes = _photos.filter((photo) => !isPortrait(photo));
  const remainingPortraits = _photos.filter(isPortrait);
  const totalWidth = Math.min(viewportWidth, MAX_VIEWPORT_WIDTH);
  const targetRowHeight = getTargetRowHeight(viewportWidth);
  const groups = [];
  let rowIndex = 0;
  let previousPortraitIndex = null;

  while (remainingLandscapes.length || remainingPortraits.length) {
    const row = [];
    let aspectRatioTotal = 0;
    const preferredPortraitIndex = getPreferredPortraitIndex(
      rowIndex,
      previousPortraitIndex
    );

    while (remainingLandscapes.length || remainingPortraits.length) {
      const photo = getNextPhoto(
        remainingLandscapes,
        remainingPortraits,
        row.length,
        preferredPortraitIndex
      );
      row.push(photo);
      aspectRatioTotal += getAspectRatio(photo);

      const gaps = (row.length + 1) * PHOTO_GAP;
      const estimatedHeight = (totalWidth - gaps) / aspectRatioTotal;

      if (
        estimatedHeight <= targetRowHeight &&
        (row.some(isPortrait) || !remainingPortraits.length)
      ) {
        break;
      }
    }

    const isFinalRow =
      !remainingLandscapes.length && !remainingPortraits.length;
    const gaps = (row.length + 1) * PHOTO_GAP;
    const availableWidth = totalWidth - gaps;
    const estimatedHeight = availableWidth / aspectRatioTotal;
    const height = isFinalRow
      ? Math.min(targetRowHeight, estimatedHeight)
      : estimatedHeight;

    groups.push({
      key: row.map((photo) => photo.key).join(""),
      height,
      photos: row.map((photo) => ({
        ...photo,
        displayedWidth: height * getAspectRatio(photo),
      })),
    });
    const portraitIndex = row.findIndex(isPortrait);
    if (portraitIndex !== -1) {
      previousPortraitIndex = portraitIndex;
    }
    rowIndex += 1;
  }

  return groups;
}

/**
 * Returns the same viewport-specific order used by the collage without rows.
 */
export function getOrderedPhotos(photos, viewportWidth) {
  return setWidthHelper(photos, viewportWidth).reduce(
    (orderedPhotos, group) => orderedPhotos.concat(group.photos),
    []
  );
}

const MAX_VIEWPORT_WIDTH = 2560;
const PHOTO_GAP = 8;
const PHOTOS_PER_ROW = 3;
import type { CollagePhoto, PhotoGroup } from "../types";

/**
 * Returns the displayed image width-to-height ratio.
 */
function getAspectRatio(photo: CollagePhoto) {
  return photo.aspectRatio;
}

/**
 * Selects the target height used when deciding where a row ends.
 */
function getTargetRowHeight(viewportWidth: number) {
  if (viewportWidth > 1400) {
    return 450;
  }

  if (viewportWidth >= 1400) {
    return 600;
  }

  return 370;
}

/**
 * Groups photos into justified rows and adds a displayed width to each photo.
 *
 * Photos are already ordered in content.json. The returned groups contain a
 * key, row height, and laid-out photo objects.
 */
export default function setWidthHelper(
  photos: CollagePhoto[],
  viewportWidth: number
): PhotoGroup[] {
  const remainingPhotos = [...photos];
  const totalWidth = Math.min(viewportWidth, MAX_VIEWPORT_WIDTH);
  const targetRowHeight = getTargetRowHeight(viewportWidth);
  const groups = [];

  while (remainingPhotos.length) {
    const row = remainingPhotos.splice(0, PHOTOS_PER_ROW);
    let aspectRatioTotal = 0;

    for (const photo of row) {
      aspectRatioTotal += getAspectRatio(photo);
    }

    const isFinalRow =
      !remainingPhotos.length;
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
  }

  return groups;
}

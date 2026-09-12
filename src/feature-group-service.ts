import type { RawPhoto } from "./types";

// &feature=egypt,2018+maldives,2018
function isInFeature(photo: RawPhoto, featureSet: string[]): boolean {
  return featureSet.some((feature) => {
    const tags = feature.split(",").map((tag) => tag.toLowerCase());
    return tags.every(
      (tag) =>
        photo.year === tag ||
        photo.tags.includes(tag) ||
        (photo.location || "").toLowerCase().match(tag)
    );
  });
}

export function getFeatureName(featureSet?: string[]): string | undefined {
  if (!featureSet) {
    return;
  }
  const featureNames = featureSet.map((feature) => {
    return feature.split(",").join(", ");
  });

  if (featureNames.length > 1) {
    return (
      featureNames.slice(0, -1).join(", ") + " and " + featureNames.slice(-1)
    );
  }

  return featureNames[0];
};

export function groupByFeature(
  photos: RawPhoto[],
  featureSet: string[]
): RawPhoto[] {
  photos.forEach((photo) => {
    photo.featured = isInFeature(photo, featureSet);
  });

  return photos;
}

// &feature=egypt,2018+maldives,2018
function isInFeature(photo, featureSet) {
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

module.exports.getFeatureName = (featureSet) => {
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

module.exports.groupByFeature = (photos, featureSet) => {
  photos.forEach((photo) => {
    photo.featured = isInFeature(photo, featureSet);
  });

  return photos;
};

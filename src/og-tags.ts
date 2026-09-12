import { BASE_SITE_DESCRIPTION } from "./constants";
import { photoTitle, featureTitle } from "./title-service";
import type { ClientPhoto } from "./types";

const name = "Mostly Animals";

function buildUrl({
  selectedPhoto,
  feature,
}: {
  selectedPhoto?: ClientPhoto;
  feature?: string[] | null;
}) {
  let url = "https://www.mostlyanimals.net";

  if (selectedPhoto) {
    return url + `/photos/${selectedPhoto.key}`;
  }

  if (feature) {
    url += `/?feature=${feature.join("&feature=")}`;
  }

  return url;
}

// todo
const feature = null;
const featureName = null;

export function forOne(
  selectedPhoto: ClientPhoto
): Record<string, string | number | null> {
  const selectedPhotoSize = selectedPhoto.resize.medium;
  const photoUrl = [selectedPhoto.baseUrl, selectedPhotoSize.path].join("/");

  return {
    "og:type": "article",
    "og:site_name": name,
    "og:title": feature ? featureTitle(featureName) : photoTitle(selectedPhoto),
    "og:url": buildUrl({ selectedPhoto, feature }),
    "og:description": selectedPhoto.description,
    "og:image": photoUrl,
    "og:image:width": selectedPhotoSize.width,
    "og:image:height": selectedPhotoSize.height,
  };
}

export function forAll(): Record<string, string | number | null> {
  return {
    "og:type": "article",
    "og:site_name": name,
    "og:title": featureTitle(featureName),
    "og:url": buildUrl({ feature }),
    "og:description": BASE_SITE_DESCRIPTION,
    "og:image": "https://www.mostlyanimals.net/images/logo.png",
    "og:image:width": 1300,
    "og:image:height": 616,
  };
}

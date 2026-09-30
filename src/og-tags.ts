import { BASE_SITE_DESCRIPTION } from "./constants";
import { photoTitle } from "./title-service";
import type { DetailPagePhoto } from "./types";

const name = "Mostly Animals";

export function forOne(
  selectedPhoto: DetailPagePhoto
): Record<string, string | number | null> {
  const selectedPhotoSize = selectedPhoto.resize.medium;
  const photoUrl = [selectedPhoto.baseUrl, selectedPhotoSize.path].join("/");

  return {
    "og:type": "article",
    "og:site_name": name,
    "og:title": photoTitle(selectedPhoto),
    "og:url": `https://www.mostlyanimals.net/photos/${selectedPhoto.key}`,
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
    "og:title": "Mostly Animals",
    "og:url": "https://www.mostlyanimals.net",
    "og:description": BASE_SITE_DESCRIPTION,
    "og:image": "https://www.mostlyanimals.net/images/logo.png",
    "og:image:width": 1300,
    "og:image:height": 616,
  };
}

import type { RawPhoto } from "./types";

export function getPhotosWithTags(
  photos: RawPhoto[],
  tags: string[],
): RawPhoto[] {
  return photos.filter((photo) =>
    tags.some((tag) => photo.tags.includes(tag)),
  );
}

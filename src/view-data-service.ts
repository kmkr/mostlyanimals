import listPhotos from "../server/photos/list";
import type { RawPhoto } from "./types";

export function getPhotoData(): Promise<RawPhoto[]> {
  return listPhotos();
}

const stopWords = [/\d{4}/];

function noStopWords(elem: string): boolean {
  return !stopWords.some((sw) => sw.test(elem));
}

function onlyUnique(value: string, index: number, ary: string[]): boolean {
  return ary.indexOf(value) === index;
}

function reduceFlatten(a: string[], b: string[]): string[] {
  return a.concat(b);
}

export function getKeywordsForPhoto(photo: RawPhoto): string[] {
  return [photo.title, ...(photo.location || "").split(", "), ...photo.tags]
    .filter((t): t is string => Boolean(t))
    .filter(noStopWords);
}

export function getAllKeywords(): Promise<string[]> {
  return getPhotoData().then((photos) =>
    [
      "diving",
      "scuba",
      "underwater",
      "photography",
      "fish",
      "nudibranch",
      "crab",
      "shrimp",
      "shark",
      "macro",
      ...photos
        // Location tags are separated by commas - I want all such word groups to be candidates for unique filter so that "The Philippines", "Pandan Island, The Philippines" and "Apo Reef, The Philippines" ends up as three separate keywords "Pandan Island", "Apo Reef" and "The Philippines"
        .map((p) => (p.location || "").split(", "))
        .reduce(reduceFlatten, []),
      ...photos
        .map((p) => p.tags)
        .reduce(reduceFlatten, [])
        .filter(noStopWords),
    ]
      .filter(onlyUnique)
      .filter((t) => t)
  );
}

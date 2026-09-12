import { S3_BASE } from "./constants";
import buildSrcSet from "./src-set-builder";
import type { ClientPhoto, RawPhoto, ResizeData } from "../../src/types";

function getMode(resizeData: ResizeData): ClientPhoto["mode"] {
  const { width, height } = resizeData[Object.keys(resizeData)[0] as keyof ResizeData];

  return width > height ? "landscape" : "portrait";
}

export function serverToClient(photo: RawPhoto): ClientPhoto {
  return {
    name: photo.name,
    key: photo.key,
    title: photo.title || null,
    description: photo.description || null,
    latin: photo.latin || null,
    location: photo.location || null,
    mode: getMode(photo.resize),
    baseUrl: S3_BASE,
    resize: photo.resize,
    srcSet: buildSrcSet(S3_BASE, photo.resize),
  };
};

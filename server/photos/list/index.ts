import photos from "../../../content.json";
import type { RawPhoto } from "../../../src/types";

export default function listPhotos(): Promise<RawPhoto[]> {
  return Promise.resolve(photos as RawPhoto[]);
}

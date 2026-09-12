const BASE_TITLE = "Mostly Animals";
import type { DetailPagePhoto } from "./types";

export function photoTitle(photo: Pick<DetailPagePhoto, "title">): string {
  return [photo.title, BASE_TITLE].filter(Boolean).join(" :: ");
};

export function featureTitle(featureName?: string | null): string {
  return [featureName, BASE_TITLE].filter(Boolean).join(" :: ");
};

export function baseTitle(): string {
  return BASE_TITLE;
};

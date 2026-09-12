const BASE_TITLE = "Mostly Animals";
import type { ClientPhoto } from "./types";

export function photoTitle(photo: Pick<ClientPhoto, "title">): string {
  return [photo.title, BASE_TITLE].filter(Boolean).join(" :: ");
};

export function featureTitle(featureName?: string | null): string {
  return [featureName, BASE_TITLE].filter(Boolean).join(" :: ");
};

export function baseTitle(): string {
  return BASE_TITLE;
};

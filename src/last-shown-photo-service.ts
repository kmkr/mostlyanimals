let lastShownPhotoKey: string | null = null;

export function setLastShownPhotoKey(key: string): void {
  lastShownPhotoKey = key;
}

export function getLastShownPhotoKey(): string | null {
  return lastShownPhotoKey;
}

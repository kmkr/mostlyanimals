export type PhotoMode = "landscape" | "portrait";

export type ResizeName =
  | "thumb"
  | "xsmall"
  | "small"
  | "medium"
  | "large"
  | "xlarge";

export interface ResizeMetadata {
  width: number;
  height: number;
  path: string;
  url?: string;
}

export type ResizeData = Record<ResizeName, ResizeMetadata>;

export interface RawPhoto {
  key: string;
  name: string;
  title?: string | null;
  description?: string | null;
  latin?: string | null;
  location?: string | null;
  tags: string[];
  width: number;
  height: number;
  resize: ResizeData;
  featured?: boolean;
  shot_at?: Date | string | null;
  year?: string | null;
}

export interface DetailPagePhoto {
  key: string;
  name: string;
  title: string | null;
  description: string | null;
  latin: string | null;
  location: string | null;
  resize: ResizeData;
  mode: PhotoMode;
  baseUrl: string;
  srcSet: string;
  featured?: boolean;
}

export interface CollagePhoto {
  key: string;
  title: string | null;
  description: string | null;
  latin: string | null;
  location: string | null;
  aspectRatio: number;
  srcSet: string;
  featured?: boolean;
}

export interface LayoutPhoto extends CollagePhoto {
  displayedWidth: number;
}

export interface PhotoGroup {
  key: string;
  height: number;
  photos: LayoutPhoto[];
}

export interface ResizeTarget {
  name: ResizeName;
  shortName: string;
  width: number;
}

export interface ResizedPhoto {
  sizeLabel: ResizeName;
  width: number;
  height: number;
  buffer: Buffer;
}

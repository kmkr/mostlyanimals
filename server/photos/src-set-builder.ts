import type { ResizeData } from "../../src/types";

export default function buildSrcSet(baseUrl: string, sizes: ResizeData): string {
  return (Object.keys(sizes) as Array<keyof ResizeData>)
    .map((key) => {
      const size = sizes[key];
      return `${baseUrl}/${size.path} ${size.width}w`;
    })
    .join(", ");
}

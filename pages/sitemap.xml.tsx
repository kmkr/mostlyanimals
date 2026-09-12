import { getPhotoData } from "../src/view-data-service";
import type { GetServerSideProps } from "next";

const Sitemap = () => null;

const BASE_URL = "https://www.mostlyanimals.net";

function generateSitemap(photoKeys: string[]): string {
  let str = `
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>${BASE_URL}</loc>
  </url>`;

  str += photoKeys
    .map((photoKey: string) => `<url><loc>${BASE_URL}/${photoKey}</loc></url>`)
    .join("\n");
  str += "</urlset>";
  return str;
}

export const getServerSideProps: GetServerSideProps = async function getServerSideProps(
  context
) {
  const { res } = context;
  const photos = await getPhotoData();
  res.setHeader("Content-Type", "application/xml");
  res.write(generateSitemap(photos.map((p) => p.key)));
  res.end();

  return { props: {} };
};

export default Sitemap;

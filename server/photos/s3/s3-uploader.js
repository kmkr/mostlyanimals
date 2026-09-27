import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3, generateParams } from "./s3-wrapper.js";

const oneYear = 60 * 60 * 24 * 365;

export default async function s3Uploader(buffer, name, mimetype) {
  const params = generateParams({
    ACL: "public-read",
    Key: name,
    Body: buffer,
    CacheControl: `public, max-age=${oneYear}`,
    ContentType: mimetype,
    Expires: new Date(2100, 1),
  });

  console.log("[s3-uploader] Putting %s", name);
  await s3.send(new PutObjectCommand(params));
  console.log("[s3-uploader] %s uploaded to s3", name);

  return {
    uri: `/${params.Key}`,
  };
}

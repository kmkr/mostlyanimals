import { s3, generateParams } from "./s3-wrapper";

const oneYear = 60 * 60 * 24 * 365;

export default function s3Uploader(
  buffer: Buffer,
  name: string,
  mimetype: string
): Promise<{ uri: string }> {
  return new Promise((resolve, reject) => {
    const params = generateParams({
      ACL: "public-read",
      Key: name,
      Body: buffer,
      CacheControl: `public, max-age=${oneYear}`,
      ContentType: mimetype,
      Expires: new Date(2100, 1),
    });

    console.log("[s3-uploader] Putting %s", name);

    s3.putObject(params, (err) => {
      console.log("[s3-uploader] %s uploaded to s3", name);
      if (err) {
        reject(err);
        return;
      }

      resolve({
        uri: `/${params.Key}`,
      });
    });
  });
}

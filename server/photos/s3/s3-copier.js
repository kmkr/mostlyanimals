const { s3, generateParams } = require("./s3-wrapper");

const oneYear = 60 * 60 * 24 * 365;
module.exports.copyPhoto = function (from, to) {
  return new Promise((resolve, reject) => {
    console.log("[s3-copier] Copying %s to %s", from, to);

    s3.copyObject(
      generateParams({
        CopySource: from,
        Key: to,
        ACL: "public-read",
        CacheControl: `public, max-age=${oneYear}`,
        ContentType: "image/jpeg",
        Expires: new Date(2100, 1),
      }),
      (err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve(data);
      }
    );
  });
};

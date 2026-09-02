const { s3, generateParams } = require("./s3-wrapper");

const { listItems } = require("./s3-lister");
const { resizeTo } = require("../constants");

function expectNumberOfKeys() {
  const numOriginalUpload = 0;

  return resizeTo.length + numOriginalUpload;
}

module.exports.deletePhoto = function (key) {
  return new Promise((resolve, reject) => {
    return listItems(key).then((data) => {
      if (data.length > expectNumberOfKeys() + 1) {
        return reject(
          new Error(
            `Expected ${expectNumberOfKeys()} keys with prefix ${key}, but found ${
              data.length
            }. Aborting deletion`,
          ),
        );
      }

      const keys = data.map((elem) => ({
        Key: elem.Key,
      }));

      console.log("[s3-deleter] Deleting %s keys", keys.length);

      s3.deleteObjects(
        generateParams({
          Delete: {
            Objects: keys,
          },
        }),
        (err, data) => {
          if (err) {
            return reject(err);
          }

          return resolve(data);
        },
      );
    });
  });
};

const gm = require("gm");

module.exports.resize = function (filePath, size, sizeLabel) {
  return new Promise((resolve, reject) => {
    console.log("[resizer.js] Resizing file %s to %s", filePath, size);
    gm(filePath)
      .resize(size, size)
      .autoOrient()
      .stream((err, stdout) => {
        if (err) {
          return reject(err);
        }
        let buf = Buffer.from("");
        stdout.on("data", (data) => {
          buf = Buffer.concat([buf, data]);
        });
        stdout.on("end", () => {
          gm(buf).identify((_, value) => {
            return resolve({
              sizeLabel,
              ...value.size,
              buffer: buf,
            });
          });
        });
      });
  });
};

function parseDate(exifDate) {
  if (!exifDate) return new Date();
  const parts = exifDate.split(" ");
  if (parts.length === 2) {
    const datePart = parts[0].replace(/:/g, "-");
    const timePart = parts[1];
    const parsed = new Date(`${datePart}T${timePart}`);
    if (!isNaN(parsed.getTime())) return parsed;
  }
  const fallback = new Date(exifDate.replace(":", "-"));
  return isNaN(fallback.getTime()) ? new Date() : fallback;
}

function getMetadata(identification) {
  const exif = identification["Profile-EXIF"];

  if (!exif) {
    return {
      description: "",
      shot_at: new Date(),
    };
  }

  const dateTimeOrig = exif["Date Time Original"];

  return {
    // todo: add title from suitable metadata field
    description: exif["Image Description"] || "",
    shot_at: dateTimeOrig ? parseDate(dateTimeOrig) : new Date(),
  };
}

module.exports.metadata = function (filePath) {
  return new Promise((resolve, reject) => {
    gm(filePath).identify((err, value) => {
      if (err) {
        return reject(err);
      }

      console.log("[gm] metadata for %s is %o", filePath, value);
      return resolve(
        Object.assign(
          {
            ...value.size,
          },
          getMetadata(value)
        )
      );
    });
  });
};

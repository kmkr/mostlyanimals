const photos = require("../../../content.json");
const photoDataFormatter = require("../photo-data-formatter");

module.exports = () => {
  return Promise.resolve(photoDataFormatter.dbToClient(photos));
};

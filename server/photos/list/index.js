const photos = require("../../../content.json");

module.exports = () => {
  return Promise.resolve(photos);
};

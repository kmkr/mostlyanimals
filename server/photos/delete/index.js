const { deletePhoto } = require("../s3/s3-deleter");

module.exports = (key) => {
  return deletePhoto(key).then(() => ({ key }));
};

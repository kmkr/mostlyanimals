const { BASE } = require("./constants");
import buildSrcSet from "./src-set-builder";

function getMode(resizeData) {
  const { width, height } = resizeData[Object.keys(resizeData)[0]];

  return width > height ? "landscape" : "portrait";
}

module.exports.serverToClient = function (photo) {
  return {
    name: photo.name,
    key: photo.key,
    title: photo.title || null,
    description: photo.description || null,
    latin: photo.latin || null,
    location: photo.location || null,
    mode: getMode(photo.resize),
    baseUrl: BASE,
    resize: photo.resize,
    srcSet: buildSrcSet(BASE, photo.resize),
  };
};

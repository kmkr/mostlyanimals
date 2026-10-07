import { deletePhoto } from "./s3-deleter.js";

export default function deletePhotoHandler(key) {
  return deletePhoto(key).then(() => ({ key }));
}

import { deletePhoto } from "../s3/s3-deleter";

export default function deletePhotoHandler(key: string) {
  return deletePhoto(key).then(() => ({ key }));
}

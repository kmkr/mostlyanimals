import type { ClientPhoto } from "../types";

const PhotoText = ({ photo }: { photo: ClientPhoto }) => (
  <div className="photo-text-wrapper">
    <p className="title">{photo.title}</p>
    <p className="latin">{photo.latin}</p>
    <p className="description">{photo.description}</p>
    <p className="location">{photo.location}</p>
  </div>
);

export default PhotoText;

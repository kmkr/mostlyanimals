import type { DetailPagePhoto } from "../types";

type PhotoTextData = Pick<
  DetailPagePhoto,
  "title" | "latin" | "description" | "location"
>;

const PhotoText = ({ photo }: { photo: PhotoTextData }) => (
  <div className="photo-text-wrapper">
    <p className="title">{photo.title}</p>
    <p className="latin">{photo.latin}</p>
    <p className="description">{photo.description}</p>
    <p className="location">{photo.location}</p>
  </div>
);

export default PhotoText;

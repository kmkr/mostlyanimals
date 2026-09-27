import type { DetailPagePhoto } from "../types";

type PhotoTextData = Pick<
  DetailPagePhoto,
  "title" | "latin" | "description" | "location"
>;

const PhotoText = ({ photo }: { photo: PhotoTextData }) => (
  <div className="photo-text-wrapper">
    <p className="title">{photo.title}</p>
    <p className="latin">{photo.latin}</p>
    <p className="description">
      {photo.description?.split(/_(.+?)_/g).map((part, index) =>
        index % 2 === 1 ? <em key={index}>{part}</em> : part,
      )}
    </p>
    <p className="location">{photo.location}</p>
  </div>
);

export default PhotoText;

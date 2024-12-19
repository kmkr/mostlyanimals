import { useState, useEffect } from "react";
import Photo from "./photo";
import setPhotoWidth from "./set-width-helper";
import throttle from "./throttle";
import getViewportWidth from "./get-width";
import MidWater from "./mid-water";
import { DEFAULT_VIEWPORT_WIDTH } from "../constants";

function isCollage(viewportWidth) {
  return viewportWidth > 1100;
}

const PhotoGroup = ({ group, viewportWidth }) => {
  const setDimensions = isCollage(viewportWidth);
  const style = setDimensions ? { height: `${group.height}px` } : {};
  return (
    <div className="photo-group" key={`photo-group-${group.key}`} style={style}>
      {group.photos.map((photo) => (
        <Photo key={photo.key} setWidth={setDimensions} photo={photo} />
      ))}
    </div>
  );
};

const Collage = ({ featuredPhotos, nonFeaturedPhotos }) => {
  const [viewportWidth, setViewportWidth] = useState(DEFAULT_VIEWPORT_WIDTH);

  function updateWidth() {
    setViewportWidth(getViewportWidth());
  }

  useEffect(() => {
    throttle("resize", "optimizedResize");
    window.addEventListener("optimizedResize", updateWidth);

    updateWidth();

    return function cleanup() {
      window.removeEventListener("optimizedResize", updateWidth);
    };
  }, []);

  const featuredPhotoGroups = setPhotoWidth(featuredPhotos, viewportWidth);
  const nonFeaturedPhotoGroups = setPhotoWidth(
    nonFeaturedPhotos,
    viewportWidth
  );
  return (
    <div id="collage">
      {featuredPhotoGroups.map((group) => (
        <PhotoGroup
          key={group.key}
          group={group}
          viewportWidth={viewportWidth}
        />
      ))}
      {!!featuredPhotoGroups.length && <MidWater />}
      {nonFeaturedPhotoGroups.map((group) => (
        <PhotoGroup
          key={group.key}
          group={group}
          viewportWidth={viewportWidth}
        />
      ))}
    </div>
  );
};

export default Collage;

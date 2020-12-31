import { useEffect, useState } from "react";

import MAHead from "../../src/ma-head";
import { getPhotoData, getKeywordsForPhoto } from "../../src/view-data-service";
import { serverToClient } from "../../server/photos/photo-data-conversion";
import { forOne } from "../../src/og-tags";
import buildSrcSet from "../../src/photos/src-set-builder";
import PhotoWrapper from "../../src/photos/photo-wrapper";
import { photoTitle } from "../../src/title-service";
import { setLastShownPhotoKey } from "../../src/last-shown-photo-service";
import { DEFAULT_VIEWPORT_WIDTH } from "../../src/constants";

function PhotoPage({ keywords, photo, nextPhoto, prevPhoto }) {
  const [availWidth, setAvailWidth] = useState(DEFAULT_VIEWPORT_WIDTH);

  useEffect(() => {
    setAvailWidth(screen.availWidth);
    setLastShownPhotoKey(photo.key);
  });

  photo.srcSet = buildSrcSet(photo.baseUrl, photo.resize, availWidth);
  nextPhoto.srcSet = buildSrcSet(
    nextPhoto.baseUrl,
    nextPhoto.resize,
    availWidth
  );
  prevPhoto.srcSet = buildSrcSet(
    prevPhoto.baseUrl,
    prevPhoto.resize,
    availWidth
  );

  return (
    <>
      <MAHead
        title={photoTitle(photo)}
        keywords={keywords}
        meta={forOne(photo)}
      />

      <div id="container">
        <PhotoWrapper
          nextPhoto={nextPhoto}
          prevPhoto={prevPhoto}
          selectedPhoto={photo}
        />
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const allPhotos = await getPhotoData();
  return {
    paths: allPhotos.map((photo) => ({
      params: {
        id: photo.key,
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const photos = await getPhotoData();

  const selectedPhotoIndex = photos.findIndex(
    (photo) => photo.key === context.params.id
  );
  const selectedPhoto = photos[selectedPhotoIndex];

  if (!selectedPhoto) {
    return {
      notFound: true,
    };
  }

  const photoKeywords = getKeywordsForPhoto(selectedPhoto);

  const nextPhotoIndex =
    selectedPhotoIndex === photos.length - 1 ? 0 : selectedPhotoIndex + 1;
  const prevPhotoIndex =
    selectedPhotoIndex === 0 ? photos.length - 1 : selectedPhotoIndex - 1;

  const nextPhoto = photos[nextPhotoIndex];
  const prevPhoto = photos[prevPhotoIndex];

  return {
    props: {
      keywords: photoKeywords,
      photo: serverToClient(selectedPhoto),
      nextPhoto: serverToClient(nextPhoto),
      prevPhoto: serverToClient(prevPhoto),
    },
  };
}

export default PhotoPage;

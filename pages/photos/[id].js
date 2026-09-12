import { useEffect, useState } from "react";

import MAHead from "../../src/ma-head";
import { getPhotoData, getKeywordsForPhoto } from "../../src/view-data-service";
import { serverToClient } from "../../server/photos/photo-data-conversion";
import { forOne } from "../../src/og-tags";
import PhotoWrapper from "../../src/photos/photo-wrapper";
import { photoTitle } from "../../src/title-service";
import { setLastShownPhotoKey } from "../../src/last-shown-photo-service";
import getViewportWidth from "../../src/collage/get-width";
import { getOrderedPhotos } from "../../src/collage/photo-layout-helper";
import { DEFAULT_VIEWPORT_WIDTH } from "../../src/constants";

function PhotoPage({ keywords, photo, photos }) {
  const [viewportWidth, setViewportWidth] = useState(DEFAULT_VIEWPORT_WIDTH);

  useEffect(() => {
    setLastShownPhotoKey(photo.key);
    setViewportWidth(getViewportWidth());
  }, [photo.key]);

  const orderedPhotos = getOrderedPhotos(photos, viewportWidth);
  const selectedPhotoIndex = orderedPhotos.findIndex(
    (orderedPhoto) => orderedPhoto.key === photo.key
  );
  const nextPhotoFromViewport =
    orderedPhotos[(selectedPhotoIndex + 1) % orderedPhotos.length];
  const prevPhotoFromViewport =
    orderedPhotos[
      (selectedPhotoIndex - 1 + orderedPhotos.length) % orderedPhotos.length
    ];

  return (
    <>
      <MAHead
        title={photoTitle(photo)}
        keywords={keywords}
        meta={forOne(photo)}
      />

      <div id="container">
        <PhotoWrapper
          nextPhoto={nextPhotoFromViewport}
          prevPhoto={prevPhotoFromViewport}
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

  return {
    props: {
      keywords: photoKeywords,
      photo: serverToClient(selectedPhoto),
      photos: photos.map(serverToClient),
    },
  };
}

export default PhotoPage;

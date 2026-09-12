import { useEffect } from "react";

import MAHead from "../../src/ma-head";
import { getPhotoData, getKeywordsForPhoto } from "../../src/view-data-service";
import { serverToClient } from "../../server/photos/photo-data-conversion";
import { forOne } from "../../src/og-tags";
import PhotoWrapper from "../../src/photos/photo-wrapper";
import { photoTitle } from "../../src/title-service";
import { setLastShownPhotoKey } from "../../src/last-shown-photo-service";
import type { GetStaticPaths, GetStaticProps } from "next";
import type { ClientPhoto } from "../../src/types";

type PhotoPageProps = {
  keywords: string[];
  photo: ClientPhoto;
  nextPhoto: ClientPhoto;
  prevPhoto: ClientPhoto;
};

function PhotoPage({ keywords, photo, nextPhoto, prevPhoto }: PhotoPageProps) {
  useEffect(() => {
    setLastShownPhotoKey(photo.key);
  }, [photo.key]);

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

export const getStaticPaths: GetStaticPaths = async () => {
  const allPhotos = await getPhotoData();
  return {
    paths: allPhotos.map((photo) => ({
      params: {
        id: photo.key,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PhotoPageProps> = async (
  context
) => {
  const photos = await getPhotoData();
  const photoId = context.params?.id;

  const selectedPhotoIndex = photos.findIndex(
    (photo) => photo.key === photoId
  );
  const selectedPhoto = photos[selectedPhotoIndex];

  if (!selectedPhoto) {
    return {
      notFound: true,
    };
  };

  const photoKeywords = getKeywordsForPhoto(selectedPhoto);
  const nextPhotoIndex =
    selectedPhotoIndex === photos.length - 1 ? 0 : selectedPhotoIndex + 1;
  const prevPhotoIndex =
    selectedPhotoIndex === 0 ? photos.length - 1 : selectedPhotoIndex - 1;

  return {
    props: {
      keywords: photoKeywords,
      photo: serverToClient(selectedPhoto),
      nextPhoto: serverToClient(photos[nextPhotoIndex]),
      prevPhoto: serverToClient(photos[prevPhotoIndex]),
    },
  };
};

export default PhotoPage;

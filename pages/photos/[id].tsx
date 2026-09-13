import { useEffect } from "react";

import type { GetStaticPaths, GetStaticProps } from "next";
import { convertServerDTOToDetailPageDTO } from "../../server/photos/photo-data-conversion";
import { setLastShownPhotoKey } from "../../src/last-shown-photo-service";
import MAHead from "../../src/ma-head";
import { forOne } from "../../src/og-tags";
import PhotoWrapper from "../../src/photos/photo-wrapper";
import { photoTitle } from "../../src/title-service";
import type { DetailPagePhoto } from "../../src/types";
import { getKeywordsForPhoto, getPhotoData } from "../../src/view-data-service";

type PhotoPageProps = {
  keywords: string[];
  photo: DetailPagePhoto;
  nextPhoto: DetailPagePhoto;
  prevPhoto: DetailPagePhoto;
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
  context,
) => {
  const photos = await getPhotoData();
  const photoId = context.params?.id;

  const selectedPhotoIndex = photos.findIndex((photo) => photo.key === photoId);
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

  return {
    props: {
      keywords: photoKeywords,
      photo: convertServerDTOToDetailPageDTO(selectedPhoto),
      nextPhoto: convertServerDTOToDetailPageDTO(photos[nextPhotoIndex]),
      prevPhoto: convertServerDTOToDetailPageDTO(photos[prevPhotoIndex]),
    },
  };
};

export default PhotoPage;

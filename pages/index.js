import Head from "next/head";
import { useState, useEffect } from "react";

import Collage from "../src/collage/collage";
import { getPhotoData, getAllKeywords } from "../server/view-data-service";
import { serverToClient } from "../server/photos/photo-data-conversion";
import { forAll } from "../server/og-tags";
import buildSrcSet from "../src/photos/src-set-builder";
import TopLogo from "../src/top-logo";
import DeepWater from "../src/deep-water";
import { baseTitle } from "../src/title-service";
import { getLastShownPhotoKey } from "../src/last-shown-photo-service";

function scrollToPhoto(key, retryNum) {
  setTimeout(() => {
    const elem = document.querySelector(`[data-photo-key="${key}"]`);
    if (!elem) {
      if (retryNum < 3) {
        return this.scrollToPhoto(key, retryNum + 1);
      }
    }

    window.scroll({ top: elem.offsetTop - 50 });
  }, 50);
}

function onGoToPhotos(e, offset) {
  e && e.preventDefault();

  setTimeout(() => {
    const y = document.querySelector("#top-logo").offsetHeight + (offset || 0);
    window.scroll({ top: y, behavior: "smooth" });
  });
}

function HomePage({ keywords, photos }) {
  const [availWidth, setAvailWidth] = useState(400);
  useEffect(() => {
    setAvailWidth(screen.availWidth);
  });

  useEffect(() => {
    const lastShownPhotoKey = getLastShownPhotoKey();
    if (!lastShownPhotoKey) {
      return;
    }

    scrollToPhoto(lastShownPhotoKey, 0);
  }, []);

  const photosWidthSrcSet = photos.map((photo) => {
    photo.srcSet = buildSrcSet(photo.sizes, availWidth);
    return photo;
  });

  const featuredPhotos = photos.filter((photo) => photo.featured);
  const nonFeaturedPhotos = photos.filter((photo) => !photo.featured);

  return (
    <>
      <Head>
        <title>{baseTitle()}</title>
        <meta name="keywords" content={keywords.join(", ")} />
        {Object.entries(forAll()).map(([key, value]) => (
          <meta key={key} property={key} content={value} />
        ))}
      </Head>

      <TopLogo onGoToPhotos={onGoToPhotos} />

      <div id="container">
        <Collage
          featuredPhotos={featuredPhotos}
          nonFeaturedPhotos={nonFeaturedPhotos}
        />
        <DeepWater onClick={(e) => onGoToPhotos(e, -100)} />
      </div>
    </>
  );
}

export async function getStaticProps(context) {
  return Promise.all([getPhotoData(), getAllKeywords()]).then(
    ([photoData, allKeywords]) => {
      const mappedPhotos = photoData.photos.map((p) =>
        serverToClient(p, photoData.base)
      );
      return {
        props: {
          keywords: allKeywords,
          photos: mappedPhotos,
        },
      };
    }
  );
}

export default HomePage;

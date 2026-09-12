import { useEffect } from "react";

import MAHead from "../src/ma-head";
import Collage from "../src/collage/collage";
import { getPhotoData, getAllKeywords } from "../src/view-data-service";
import { serverToClient } from "../server/photos/photo-data-conversion";
import { forAll } from "../src/og-tags";
import TopLogo from "../src/top-logo";
import DeepWater from "../src/deep-water";
import { baseTitle } from "../src/title-service";
import { getLastShownPhotoKey } from "../src/last-shown-photo-service";
import type { MouseEvent } from "react";
import type { ClientPhoto } from "../src/types";

function scrollToPhoto(key: string, retryNum: number): void {
  setTimeout(() => {
    const elem = document.querySelector(`[data-photo-key="${key}"]`);
    if (!elem) {
      if (retryNum < 3) {
        return scrollToPhoto(key, retryNum + 1);
      }
    }

    const element = elem as HTMLElement;
    window.scroll({ top: element.offsetTop - 50 });
  }, 50);
}

function onGoToPhotos(e: MouseEvent<HTMLAnchorElement>, offset = 0): void {
  if (e) {
    e.preventDefault();
  }

  setTimeout(() => {
    const topLogo = document.querySelector("#top-logo") as HTMLElement | null;
    const y = (topLogo?.offsetHeight || 0) + offset;
    window.scroll({ top: y, behavior: "smooth" });
  });
}

function HomePage({
  keywords,
  photos,
}: {
  keywords: string[];
  photos: ClientPhoto[];
}) {
  useEffect(() => {
    const lastShownPhotoKey = getLastShownPhotoKey();
    if (!lastShownPhotoKey) {
      return;
    }

    scrollToPhoto(lastShownPhotoKey, 0);
  }, []);

  const featuredPhotos = photos.filter((photo) => photo.featured);
  const nonFeaturedPhotos = photos.filter((photo) => !photo.featured);

  return (
    <>
      <MAHead title={baseTitle()} keywords={keywords} meta={forAll()} />

      <TopLogo />

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

export async function getStaticProps() {
  return Promise.all([getPhotoData(), getAllKeywords()]).then(
    ([photos, allKeywords]) => {
      const mappedPhotos = photos.map(serverToClient);
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

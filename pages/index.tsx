import { useEffect } from "react";

import { useRouter } from "next/router";
import type { MouseEvent } from "react";
import { convertServerDTOToCollageDTO } from "../server/photos/photo-data-conversion";
import Collage from "../src/collage/collage";
import DeepWater from "../src/deep-water";
import { getPhotosWithTags } from "../src/tag-filter-service";
import { getLastShownPhotoKey } from "../src/last-shown-photo-service";
import MAHead from "../src/ma-head";
import { forAll } from "../src/og-tags";
import { baseTitle } from "../src/title-service";
import TopLogo from "../src/top-logo";
import type { CollagePhoto } from "../src/types";
import { getAllKeywords, getPhotoData } from "../src/view-data-service";

const tagFilters = [
  { label: "animals", tags: ["animal", "animals"] },
  { label: "landscapes", tags: ["landscape"] },
  { label: "mountains", tags: ["mountain", "mountains"] },
  { label: "underwater", tags: ["underwater"] },
];

function scrollToPhoto(key: string, retryNum: number): void {
  setTimeout(() => {
    const elem = document.querySelector(`[data-photo-key="${key}"]`);
    if (!elem) {
      if (retryNum < 3) {
        return scrollToPhoto(key, retryNum + 1);
      }
      return;
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
  featurePhotoKeys,
}: {
  keywords: string[];
  photos: CollagePhoto[];
  featurePhotoKeys: Record<string, string[]>;
}) {
  const router = useRouter();
  const activeFilter =
    typeof router.query.tag === "string" &&
    tagFilters.some(({ label }) => label === router.query.tag)
      ? router.query.tag
      : null;

  useEffect(() => {
    const lastShownPhotoKey = getLastShownPhotoKey();
    if (!lastShownPhotoKey) {
      return;
    }

    scrollToPhoto(lastShownPhotoKey, 0);
  }, []);

  const matchingPhotoKeys = activeFilter
    ? new Set(featurePhotoKeys[activeFilter])
    : null;
  const visiblePhotos = matchingPhotoKeys
    ? photos.filter((photo) => matchingPhotoKeys.has(photo.key))
    : photos;
  const featuredPhotos = visiblePhotos.filter((photo) => photo.featured);
  const nonFeaturedPhotos = visiblePhotos.filter((photo) => !photo.featured);

  return (
    <>
      <MAHead title={baseTitle()} keywords={keywords} meta={forAll()} />

      <TopLogo />

      <div id="container">
        <nav className="tag-filters" aria-label="Filter photos by tag">
          {tagFilters.map(({ label }) => {
            const isActive = activeFilter === label;
            return (
              <button
                key={label}
                type="button"
                className={`tag-filter${isActive ? " active" : ""}`}
                aria-pressed={isActive}
                onClick={() => {
                  void router.push(
                    {
                      pathname: "/",
                      query: isActive ? {} : { tag: label },
                    },
                    undefined,
                    { shallow: true, scroll: false },
                  );
                }}
              >
                {label}
              </button>
            );
          })}
        </nav>
        <Collage
          featuredPhotos={featuredPhotos}
          nonFeaturedPhotos={nonFeaturedPhotos}
          filterTag={activeFilter}
        />
        <DeepWater onClick={(e) => onGoToPhotos(e, -100)} />
      </div>
    </>
  );
}

export async function getStaticProps() {
  return Promise.all([getPhotoData(), getAllKeywords()]).then(
    ([photos, allKeywords]) => {
      const mappedPhotos = photos.map(convertServerDTOToCollageDTO);
      const featurePhotoKeys = Object.fromEntries(
        tagFilters.map(({ label, tags }) => [
          label,
          getPhotosWithTags(photos, tags).map((photo) => photo.key),
        ]),
      );
      return {
        props: {
          keywords: allKeywords,
          photos: mappedPhotos,
          featurePhotoKeys,
        },
      };
    },
  );
}

export default HomePage;

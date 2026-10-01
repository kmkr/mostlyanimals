import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import Navigation from "./navigation";
import Photo from "./photo";
import Sidebar from "./sidebar";

import type { SyntheticEvent } from "react";
import type { DetailPagePhoto } from "../types";
import KeyboardEventHandler from "./keyboard-event-handler";

const PhotoWrapper = ({
  selectedPhoto,
  nextPhoto,
  prevPhoto,
}: {
  selectedPhoto: DetailPagePhoto;
  nextPhoto: DetailPagePhoto;
  prevPhoto: DetailPagePhoto;
}) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const router = useRouter();

  function toggleSidebar(e?: SyntheticEvent) {
    if (e) {
      e.preventDefault();
    }
    setSidebarExpanded((prevState) => !prevState);
  }

  const filterTag =
    typeof router.query.tag === "string" ? router.query.tag : null;
  const photoQuery = filterTag ? { tag: filterTag } : {};
  const homePath = filterTag
    ? `/?tag=${encodeURIComponent(filterTag)}`
    : "/";
  const photoPath = (key: string) => ({
    pathname: `/photos/${key}`,
    query: photoQuery,
  });

  return (
    <div>
      <KeyboardEventHandler
        onHome={() => {
          router.push(homePath);
        }}
        onNext={() => {
          router.push(photoPath(nextPhoto.key));
        }}
        onPrevious={() => {
          router.push(photoPath(prevPhoto.key));
        }}
        onToggleSidebar={toggleSidebar}
      />
      <Photo
        photo={selectedPhoto}
        preload={[nextPhoto, prevPhoto]}
        next={<Link href={photoPath(nextPhoto.key)} className="click-next" />}
        previous={
          <Link href={photoPath(prevPhoto.key)} className="click-previous" />
        }
      />
      <Link
        href={photoPath(prevPhoto.key)}
        className="photo-nav-button photo-nav-previous"
        aria-label="Previous photo"
      >
        &larr;
      </Link>
      <Link
        href={photoPath(nextPhoto.key)}
        className="photo-nav-button photo-nav-next"
        aria-label="Next photo"
      >
        &rarr;
      </Link>
      <Sidebar
        expanded={sidebarExpanded}
        onToggleExpanded={toggleSidebar}
        photo={selectedPhoto}
      />
      <Navigation homePath={homePath} />
    </div>
  );
};

export default PhotoWrapper;

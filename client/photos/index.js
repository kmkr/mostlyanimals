import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import Photo from "./photo";
import Navigation from "./navigation";
import Sidebar from "./sidebar";

import KeyboardEventHandler from "./keyboard-event-handler";

const PhotosWrapper = ({ selectedPhoto, nextPhoto, prevPhoto }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const router = useRouter();

  function toggleSidebar(e) {
    e && e.preventDefault();
    setSidebarExpanded((prevState) => !prevState);
  }

  return (
    <div>
      <KeyboardEventHandler
        onHome={() => {
          router.push("/");
        }}
        onNext={() => {
          router.push(`/photos/${nextPhoto.key}`);
        }}
        onPrevious={() => {
          router.push(`/photos/${prevPhoto.key}`);
        }}
        onToggleSidebar={toggleSidebar}
      />
      <Photo
        photo={selectedPhoto}
        preloadPhotos={[nextPhoto, prevPhoto]}
        next={
          <Link href={`/photos/${nextPhoto.key}`}>
            <a className="click-next" />
          </Link>
        }
        previous={
          <Link href={`/photos/${prevPhoto.key}`}>
            <a className="click-previous" />
          </Link>
        }
      />
      <Sidebar
        expanded={sidebarExpanded}
        onToggleExpanded={toggleSidebar}
        photo={selectedPhoto}
      />
      <Navigation />
    </div>
  );
};

export default PhotosWrapper;

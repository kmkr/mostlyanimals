import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import Navigation from "./navigation";
import Photo from "./photo";
import Sidebar from "./sidebar";

import KeyboardEventHandler from "./keyboard-event-handler";

const PhotoWrapper = ({ selectedPhoto, nextPhoto, prevPhoto }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const router = useRouter();

  function toggleSidebar(e) {
    e && e.preventDefault();
    setSidebarExpanded((prevState) => !prevState);
  }

  const homePath = "/";

  return (
    <div>
      <KeyboardEventHandler
        onHome={() => {
          router.push(homePath);
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
        preload={[nextPhoto, prevPhoto]}
        next={<Link href={`/photos/${nextPhoto.key}`} className="click-next" />}
        previous={
          <Link href={`/photos/${prevPhoto.key}`} className="click-previous" />
        }
      />
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

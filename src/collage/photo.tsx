import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import PhotoText from "../photos/photo-text";
import TransitionImage from "../transition-image/transition-image";
import type { LayoutPhoto } from "../types";

const Photo = ({
  photo,
  setWidth,
}: {
  photo: LayoutPhoto;
  setWidth: boolean;
}) => {
  const [inViewport, setInViewport] = useState(false);
  const domElemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "300px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setInViewport(true);
        }
      });
    }, options);
    if (domElemRef.current) {
      observer.observe(domElemRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const style = {
    width: setWidth ? `${photo.displayedWidth}px` : "100%",
  };

  return (
    <div
      ref={domElemRef}
      className="photo"
      data-photo-key={photo.key}
      style={style}
    >
      <Link href={`/photos/${photo.key}`}>
        {!!photo.title && (
          <div className="overlay-title-wrapper">
            <p className="title">{photo.title}</p>
          </div>
        )}
        {inViewport && (
          <TransitionImage
            alt={photo.title}
            srcSet={photo.srcSet}
            sizes="(min-width: 1100px) 30vw, 100vw"
          />
        )}
      </Link>

      <div className="sn-dn-ns sn-mb-l">
        <PhotoText photo={photo} />
      </div>
    </div>
  );
};

export default Photo;

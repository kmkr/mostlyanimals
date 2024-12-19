import { useState, useEffect, useRef } from "react";
import Link from "next/link";

import TransitionImage from "../transition-image/transition-image";
import PhotoText from "../photos/photo-text";

const Photo = ({ photo, setWidth }) => {
  const [inViewport, setInViewport] = useState(false);
  const domElemRef = useRef();

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
    observer.observe(domElemRef.current);
  });

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
        <a>
          {!!photo.title && (
            <div className="overlay-title-wrapper">
              <p className="title">{photo.title}</p>
            </div>
          )}
          {inViewport && (
            <TransitionImage
              alt={photo.title}
              src={`${photo.baseUrl}/${photo.resize.xsmall.path}`}
              srcSet={photo.srcSet}
              sizes="(min-width: 1100px) 30vw, 100vw"
            />
          )}
        </a>
      </Link>

      <div className="sn-dn-ns sn-mb-l">
        <PhotoText photo={photo} />
      </div>
    </div>
  );
};

export default Photo;

import { useState } from "react";
import type { MouseEventHandler } from "react";

const TransitionImage = ({
  alt,
  onClick,
  srcSet,
  sizes,
}: {
  alt?: string | null;
  onClick?: MouseEventHandler<HTMLImageElement>;
  src?: string;
  srcSet: string;
  sizes: string;
}) => {
  const [visible, setVisible] = useState(false);

  function onLoad() {
    if (visible) {
      // Some browsers call onLoad multiple times, perhaps due to srcSet
      return;
    }

    setVisible(true);
  }

  return (
    <img
      alt={alt || ""}
      className="transition-image"
      onClick={onClick}
      onLoad={onLoad}
      style={{ opacity: visible ? 1 : 0 }}
      srcSet={srcSet}
      sizes={sizes}
    />
  );
};

export default TransitionImage;

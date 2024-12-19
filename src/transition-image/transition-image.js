import { useState } from "react";

const TransitionImage = ({ alt, onClick, srcSet, sizes }) => {
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

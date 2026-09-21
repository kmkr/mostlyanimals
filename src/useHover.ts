import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";

export default function useHover(): [
  RefObject<HTMLAnchorElement | null>,
  boolean,
] {
  let timeout: ReturnType<typeof setTimeout> | null;
  const [value, setValue] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);
  const handleMouseOver = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
    setValue(true);
  };
  const handleMouseOut = () => {
    timeout = setTimeout(() => setValue(false), 4000);
  };

  useEffect(() => {
    const node = ref.current;

    if (node) {
      node.addEventListener("mouseover", handleMouseOver);
      node.addEventListener("mouseout", handleMouseOut);

      return () => {
        if (timeout) {
          clearTimeout(timeout);
        }
        node.removeEventListener("mouseover", handleMouseOver);

        node.removeEventListener("mouseout", handleMouseOut);
      };
    }
  }, []);

  return [ref, value];
}

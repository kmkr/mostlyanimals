import { useRef, useState, useEffect } from "react";
import type { RefObject } from "react";

export default function useHover(): [
  RefObject<HTMLAnchorElement | null>,
  boolean
] {
  const [value, setValue] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);
  const handleMouseOver = () => setValue(true);
  const handleMouseOut = () => setValue(false);

  useEffect(() => {
    const node = ref.current;

    if (node) {
      node.addEventListener("mouseover", handleMouseOver);
      node.addEventListener("mouseout", handleMouseOut);

      return () => {
        node.removeEventListener("mouseover", handleMouseOver);

        node.removeEventListener("mouseout", handleMouseOut);
      };
    }
  }, []);

  return [ref, value];
}

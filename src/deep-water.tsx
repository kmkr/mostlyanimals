import type { MouseEventHandler } from "react";

const DeepWater = ({
  onClick,
}: {
  onClick: MouseEventHandler<HTMLAnchorElement>;
}) => (
  <div id="deep-water">
    <div className="link-wrapper">
      <a href="#" onClick={onClick}>
        DROP YOUR WEIGHTS
      </a>
    </div>
  </div>
);

export default DeepWater;

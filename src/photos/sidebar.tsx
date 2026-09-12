import PhotoText from "./photo-text";
import type { ClientPhoto } from "../types";
import type { MouseEventHandler } from "react";

const Sidebar = ({
  expanded,
  photo,
  onToggleExpanded,
}: {
  expanded: boolean;
  photo: ClientPhoto;
  onToggleExpanded: MouseEventHandler<HTMLAnchorElement>;
}) => (
  <div id="sidebar-wrapper" className={photo.mode}>
    <div id="sidebar">
      <div className={expanded ? "expanded" : ""}>
        <a
          href="#"
          title={expanded ? "Close info box" : "Read more about this photo"}
          tabIndex={0}
          onClick={onToggleExpanded}
        >
          <span className="one" />
          <span className="two" />
        </a>
      </div>
    </div>

    <div id="sidebar-text" className={expanded ? "expanded" : ""}>
      <PhotoText photo={photo} />
    </div>
  </div>
);

export default Sidebar;

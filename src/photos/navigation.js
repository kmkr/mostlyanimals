import Link from "next/link";

const Navigation = ({ homePath }) => (
  <div id="navigation">
    <Link href={homePath} className="home" title="All photos">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 85.04 54.67">
        <rect
          fill="currentColor"
          className="cls-1"
          y="20.25"
          width="24.3"
          height="14.17"
        />
        <rect fill="currentColor" y="40.49" width="24.3" height="14.17" />
        <rect
          fill="currentColor"
          x="30.37"
          y="20.25"
          width="24.3"
          height="14.17"
        />
        <rect
          fill="currentColor"
          x="60.74"
          y="20.25"
          width="24.3"
          height="14.17"
        />
        <rect
          fill="currentColor"
          x="30.37"
          y="40.49"
          width="24.3"
          height="14.17"
        />
        <rect
          fill="currentColor"
          x="60.74"
          y="40.49"
          width="24.3"
          height="14.17"
        />
        <rect fill="currentColor" width="24.3" height="14.17" />
        <rect fill="currentColor" x="30.37" width="24.3" height="14.17" />
        <rect fill="currentColor" x="60.74" width="24.3" height="14.17" />
      </svg>
    </Link>
    <div className="link-wrapper">
      <Link href={homePath}>More photos</Link>
    </div>
  </div>
);
export default Navigation;

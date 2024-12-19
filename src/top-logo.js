import useHover from "./useHover";

const TopLogo = () => {
  const [hoverRef, isHovered] = useHover();
  return (
    <div id="top-logo">
      <div className="haiku-wrapper">
        <div className="img-wrapper">
          <img src="/images/logo_plain.svg" />
        </div>
        <div className="haiku">
          {isHovered ? (
            <>
              <p>A photo you like</p>
              <p>Rules, and what about download?</p>
              <p>I&apos;ll gladly explain</p>
            </>
          ) : (
            <>
              <p>Mostly animals</p>
              <p>Plus the occasional tree</p>
              <p>The slug welcomes you</p>
            </>
          )}
        </div>
      </div>
      <div id="contact-info">
        <p>
          by{" "}
          <a
            href="mailto:krismikael-insertathere-protonmail-insertdothere-com"
            ref={hoverRef}
          >
            Kris-Mikael Krister
          </a>
        </p>
      </div>
    </div>
  );
};

export default TopLogo;

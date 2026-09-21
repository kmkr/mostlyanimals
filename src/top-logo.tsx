import useHover from "./useHover";

const TopLogo = () => {
  const [hoverRef, isHovered] = useHover();
  return (
    <div id="top-logo">
      <div className="haiku-wrapper">
        <div className="img-wrapper">
          <img src="/images/logo_plain.svg" alt="Mostly Animals" />
        </div>
        <div className="haiku">
          {isHovered ? (
            <>
              <p>A photo you like?</p>
              <p>Send me an email</p>
              <p>
                <a
                  href="mailto:krismikael-insertathere-protonmail-insertdothere-com"
                  ref={hoverRef}
                >
                  krismikael &lt;at&gt; protonmail.com
                </a>
              </p>
            </>
          ) : (
            <>
              <p>Mostly animals</p>
              <p>Plus the occasional tree</p>
              <p>And a few landscapes</p>
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

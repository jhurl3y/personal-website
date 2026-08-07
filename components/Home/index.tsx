import Box from "@mui/material/Box";
import React, { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Container from "@mui/material/Container";
import Navbar from "../Navbar";
import Dot from "./Dot";
import Slider from "./Slider";
import { PAGES, LEFT_KEY, RIGHT_KEY, HERO_IMAGES } from "../../utils/constants";
import { getHeroSlides } from "../../utils/helpers";
import styles from "./styles";
import type { HeroImage } from "../../utils/types";

const LeftButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button color="inherit" onClick={onClick} title="left">
      <FontAwesomeIcon icon="arrow-left" size="3x" className="highlight" />
    </Button>
  );
};

const RightButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button color="inherit" onClick={onClick} title="right">
      <FontAwesomeIcon icon="arrow-right" size="3x" className="highlight" />
    </Button>
  );
};

const Home = () => {
  const [index, setIndex] = useState(0);
  const [translateValue, setTranslateValue] = useState(0);
  const [shouldTransition, setSouldTransition] = useState(true);

  // The server renders slide 0 only - the local, deterministic hero. The rest
  // are shuffled once after mount and held for the visit, so getStaticProps
  // neither freezes the order at build time nor causes a hydration mismatch.
  // No Math.random() runs during SSR or hydration.
  const [slides, setSlides] = useState<HeroImage[]>([HERO_IMAGES[0]]);

  // Bug 7.13: this was `new Array(n).fill(React.createRef())`, which puts the
  // SAME ref object in every slot - every slide shared one ref, so slideWidth()
  // never measured the slide it thought it was measuring. Creating the refs
  // during render also tripped react-hooks/refs. A single ref holding an array
  // of nodes, populated by callback refs, fixes both.
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const setSlideRef = (i: number) => (node: HTMLDivElement | null) => {
    slideRefs.current[i] = node;
  };

  const slideWidth = () => slideRefs.current[index]?.clientWidth ?? 0;

  const goToPrevSlide = () => {
    if (index === 0) {
      return;
    }

    setIndex(index - 1);
    setSouldTransition(true);
    setTranslateValue(translateValue + slideWidth());
  };

  const goToNextSlide = () => {
    if (index === slides.length - 1) {
      return;
    }

    setIndex(index + 1);
    setSouldTransition(true);
    setTranslateValue(translateValue - slideWidth());
  };

  const onResize = () => {
    setSouldTransition(false);
    setTranslateValue(index * -1 * slideWidth());
  };

  const onDotClick = (index: number) => {
    setIndex(index);
    setSouldTransition(true);
    setTranslateValue(index * -1 * slideWidth());
  };

  const onKeyDown = ({ key }: React.KeyboardEvent<HTMLDivElement>) => {
    if (key === LEFT_KEY) {
      goToPrevSlide();
    } else if (key === RIGHT_KEY) {
      goToNextSlide();
    }
  };

  // The slide order is randomised, so it cannot be computed during render (it
  // would reshuffle on every re-render) and so useIsClient does not help.
  // Running once after hydration is the documented way to defer a client-only
  // value, and the extra render is the point: it keeps SSR deterministic.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSlides(getHeroSlides());
  }, []);

  // Bug 7.11: onKeyDown used to be bound to `window`, so pressing an arrow key
  // while typing in the contact form advanced the hero carousel further up the
  // page. It is now bound to the focusable carousel region below, so it only
  // fires when the carousel itself has focus. Resize stays on window.
  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [index, translateValue]);

  return (
    <Box
      sx={styles.outer}
      role="region"
      aria-roledescription="carousel"
      aria-label="Travel photographs"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <Slider
        translateValue={translateValue}
        shouldTransition={shouldTransition}
        setSlideRef={setSlideRef}
        slides={slides}
      />
      <Box sx={styles.content}>
        <Navbar pages={PAGES} />
        <Container sx={styles.home} maxWidth={false}>
          <LeftButton onClick={goToPrevSlide} />
          <Container maxWidth="lg" fixed>
            {" "}
          </Container>
          <RightButton onClick={goToNextSlide} />
        </Container>
        {typeof window && (
          <Box sx={styles.dots}>
            {slides.map((_, i) => (
              <Dot
                i={i}
                highlight={i === index}
                onDotClick={onDotClick}
                key={i}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Home;

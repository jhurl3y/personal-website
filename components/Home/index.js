import Box from "@mui/material/Box";
import React, { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Container from "@mui/material/Container";
import Navbar from "../Navbar";
import Dot from "./Dot";
import Slider from "./Slider";
import {
  PAGES,
  LEFT_KEY,
  RIGHT_KEY,
  FIRST_IMAGE_PATH,
} from "../../utils/constants";
import { getBackground, getBackgroundUrls } from "../../utils/helpers";
import styles from "./styles";
import { chunk } from "../../utils/array";

const LeftButton = ({ onClick }) => {
  return (
    <Button color="inherit" onClick={onClick} title="left">
      <FontAwesomeIcon icon="arrow-left" size="3x" className="highlight" />
    </Button>
  );
};

const RightButton = ({ onClick }) => {
  return (
    <Button color="inherit" onClick={onClick} title="right">
      <FontAwesomeIcon icon="arrow-right" size="3x" className="highlight" />
    </Button>
  );
};

const Home = () => {
  const backgroundUrls = getBackgroundUrls();
  const [index, setIndex] = useState(0);
  const [translateValue, setTranslateValue] = useState(0);
  const [shouldTransition, setSouldTransition] = useState(true);
  const [backgrounds, setBackgrounds] = useState([FIRST_IMAGE_PATH]);

  // Bug 7.13: this was `new Array(n).fill(React.createRef())`, which puts the
  // SAME ref object in every slot - every slide shared one ref, so slideWidth()
  // never measured the slide it thought it was measuring. Creating the refs
  // during render also tripped react-hooks/refs. A single ref holding an array
  // of nodes, populated by callback refs, fixes both.
  const slideRefs = useRef([]);
  const setSlideRef = (i) => (node) => {
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
    if (index === backgrounds.length - 1) {
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

  const onDotClick = (index) => {
    setIndex(index);
    setSouldTransition(true);
    setTranslateValue(index * -1 * slideWidth());
  };

  const onKeyDown = ({ key }) => {
    if (key === LEFT_KEY) {
      goToPrevSlide();
    } else if (key === RIGHT_KEY) {
      goToNextSlide();
    }
  };

  async function loadBackgrounds() {
    // Backgrounds already fetched
    if (backgrounds.length >= backgroundUrls.length) {
      return;
    }

    // Split the backgrounds into chunks
    const chunkedBackgroundUrls = chunk(backgroundUrls, 3);
    chunkedBackgroundUrls.map((chunkOfBackgroundUrls) => {
      // Fetch all backgrounds in a chunk at once
      Promise.all(chunkOfBackgroundUrls.map((url) => getBackground(url))).then(
        (fetchedBackgrounds) => {
          setBackgrounds((backgrounds) => [
            ...backgrounds,
            ...fetchedBackgrounds,
          ]);
        }
      );
    });
  }

  // Same as componentDidMount; only execute on the first render
  useEffect(() => {
    if (typeof window) {
      loadBackgrounds();
    }
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
        backgrounds={backgrounds}
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
            {backgrounds.map((_, i) => (
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

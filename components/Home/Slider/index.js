import React from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import { IMAGE_TRANSITION_DURATION } from "../../../utils/constants";
import styles from "../styles";

// The desktop and mobile buckets are differently cropped, so this is art
// direction rather than plain responsive sizing - hence <picture> with explicit
// sources rather than a single `sizes` attribute on one src.
const ImageWrapper = React.forwardRef(({ slide, preload }, ref) => {
  return (
    <Box
      sx={styles.image}
      ref={ref}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <Image
        src={slide.desktopSrc}
        fill
        // Slide 0 is the LCP element, so it preloads. Next 16 deprecates
        // `priority` in favour of `preload`.
        //
        // The rest are eager, NOT lazy. This carousel moves slides with
        // translateX, and native lazy-loading only re-evaluates intersection on
        // scroll/resize - not on transform changes - so lazy slides here never
        // load at all. (The getBackground() blob-fetch this replaced was
        // incidentally what used to pull them in.) They are only mounted after
        // hydration, so they never block first paint.
        preload={preload}
        loading={preload ? undefined : "eager"}
        sizes="100vw"
        alt={slide.alt}
        style={{
          objectFit: "cover",
          objectPosition: "50% 60%",
          filter: "brightness(50%)",
        }}
      />
    </Box>
  );
});

ImageWrapper.displayName = "ImageWrapper";

const Slider = ({ translateValue, shouldTransition, setSlideRef, slides }) => (
  <Box
    sx={styles.slider}
    style={{
      display: "flex",
      transform: `translateX(${translateValue}px)`,
      transition: `transform ${
        shouldTransition ? IMAGE_TRANSITION_DURATION : 0
      }s ease-out`,
      width: `${slides.length * 100}%`,
      height: "100%",
    }}
  >
    {slides.map((slide, i) => (
      <ImageWrapper
        key={slide.id}
        slide={slide}
        preload={i === 0}
        ref={setSlideRef(i)}
      />
    ))}
  </Box>
);

export default Slider;

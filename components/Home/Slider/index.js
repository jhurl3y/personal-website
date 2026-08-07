import Box from "@mui/material/Box";
import React from "react";
import Image from "next/image";
import { IMAGE_TRANSITION_DURATION } from "../../../utils/constants";
import styles from "../styles";

const ImageWrapper = React.forwardRef(({ image }, ref) => {
  return (
    <Box
      sx={styles.image}
      ref={ref}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      {/* `layout`, `objectFit` and `objectPosition` are next/image props from
          Next 12. Next 13 moved them into `fill` + `style`, and Next 16 ignores
          the old ones entirely - which is why the hero rendered as a bare
          background colour after the upgrade. */}
      <Image
        src={image}
        fill
        sizes="100vw"
        alt="Background Image"
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

const Slider = ({
  translateValue,
  shouldTransition,
  setSlideRef,
  backgrounds,
}) => (
  <Box
    sx={styles.slider}
    style={{
      display: "flex",
      transform: `translateX(${translateValue}px)`,
      transition: `transform ${
        shouldTransition ? IMAGE_TRANSITION_DURATION : 0
      }s ease-out`,
      width: `${backgrounds.length * 100}%`,
      height: "100%",
    }}
  >
    {backgrounds.map((image, i) => (
      <ImageWrapper key={i} image={image} ref={setSlideRef(i)} />
    ))}
  </Box>
);

export default Slider;

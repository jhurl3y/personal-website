import React from "react";
import Image from "next/image";
import { IMAGE_TRANSITION_DURATION } from "../../../utils/constants";

const ImageWrapper = React.forwardRef(({ image, classes }, ref) => {
  return (
    <div
      className={classes.image}
      ref={ref}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <Image
        src={image}
        layout="fill"
        objectFit="cover"
        objectPosition="50% 60%"
        alt="Background Image"
        style={{ filter: "brightness(50%)" }}
      />
    </div>
  );
});

export default ({
  classes,
  translateValue,
  shouldTransition,
  refs,
  backgrounds,
}) => (
  <div
    className={classes.slider}
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
      <ImageWrapper key={i} image={image} classes={classes} ref={refs[i]} />
    ))}
  </div>
);

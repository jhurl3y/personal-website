import React, { useEffect, Suspense } from "react";
import Image from "next/image";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Slide } from "react-awesome-reveal";
import RightRail from "./rightRail";
import { aboutStrings } from "../../utils/strings";
import Styles from "./styles";
import { WIDGET_HEIGHT, fadeDuration } from "../../utils/constants";
import { Spotify } from "react-spotify-embed";

export default ({ spotify }) => {
  const classes = Styles();

  // disable radio button keydown event
  useEffect(() => {
    window.addEventListener("keydown", () => null);

    return () => {
      window.removeEventListener("keydown", () => null);
    };
  }, []);

  return (
    <Container className={classes.container} maxWidth={false}>
      <Slide duration={fadeDuration} direction="right" triggerOnce>
        <Typography variant="h2" align="center" className={classes.heading}>
          {aboutStrings.about}
        </Typography>
      </Slide>
      <Container className={classes.aboutContent}>
        <Grid container>
          <Grid item sm={12} md={6}>
            <Slide duration={fadeDuration} direction="left" triggerOnce>
              <Container maxWidth={false} className={classes.imageContainer}>
                <Image
                  src="/static/assets/images/about.webp"
                  width={499}
                  height={597}
                  alt="about me"
                  priority={false}
                />
              </Container>
            </Slide>
          </Grid>
          <Grid item sm={12} md={6}>
            <Slide duration={fadeDuration} direction="right" triggerOnce>
              <RightRail />
            </Slide>
          </Grid>
        </Grid>
      </Container>
      <Slide duration={fadeDuration} direction="left" triggerOnce>
        <Typography variant="h2" align="center" className={classes.subHeading}>
          {aboutStrings.music}
        </Typography>
      </Slide>
      <Container className={classes.musicContent}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={12} md={12} className={classes.musicItem}>
            <Slide duration={fadeDuration} direction="right" triggerOnce>
              <Suspense fallback={<p>Loading feed...</p>}>
                <Spotify
                  link={spotify}
                  title="spotify widget"
                  width="100%"
                  height={WIDGET_HEIGHT}
                  frameBorder="0"
                />
              </Suspense>
            </Slide>
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
};

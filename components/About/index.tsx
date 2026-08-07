import React from "react";
import Image from "next/image";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Slide } from "react-awesome-reveal";
import RightRail from "./rightRail";
import ListeningRoom from "./ListeningRoom";
import { aboutStrings } from "../../utils/strings";
import styles from "./styles";
import { FEATURED_PLAYLIST, fadeDuration } from "../../utils/constants";

const About = () => {
  return (
    <Container sx={styles.container} maxWidth={false}>
      <Slide duration={fadeDuration} direction="right" triggerOnce>
        <Typography variant="h2" align="center" sx={styles.heading}>
          {aboutStrings.about}
        </Typography>
      </Slide>
      <Container sx={styles.aboutContent}>
        <Grid container>
          <Grid size={{ sm: 12, md: 6 }}>
            <Slide duration={fadeDuration} direction="left" triggerOnce>
              <Container maxWidth={false} sx={styles.imageContainer}>
                <Image
                  src="/static/assets/images/about.webp"
                  width={499}
                  height={597}
                  alt="about me"
                />
              </Container>
            </Slide>
          </Grid>
          <Grid size={{ sm: 12, md: 6 }}>
            <Slide duration={fadeDuration} direction="right" triggerOnce>
              <RightRail />
            </Slide>
          </Grid>
        </Grid>
      </Container>
      <Slide duration={fadeDuration} direction="left" triggerOnce>
        <Typography variant="h2" align="center" sx={styles.subHeading}>
          {aboutStrings.music}
        </Typography>
      </Slide>
      <Container sx={styles.musicContent}>
        <Slide duration={fadeDuration} direction="right" triggerOnce>
          <ListeningRoom playlist={FEATURED_PLAYLIST} />
        </Slide>
      </Container>
    </Container>
  );
};

export default About;

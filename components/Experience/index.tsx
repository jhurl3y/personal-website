import React from "react";
import { Slide } from "react-awesome-reveal";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { fadeDuration } from "../../utils/constants";
import Timeline from "./timeline";
import Skills from "./skills";
import Link from "@mui/material/Link";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { experienceStrings } from "../../utils/strings";
import styles from "./styles";

const Experience = () => {
  return (
    <Container sx={styles.container} maxWidth={false}>
      <Slide duration={fadeDuration} direction="right" triggerOnce>
        <Typography variant="h2" align="center" sx={styles.heading}>
          {experienceStrings.experience}
        </Typography>
      </Slide>
      <Timeline />
      <Slide duration={fadeDuration} direction="left" triggerOnce>
        <Typography variant="h3" align="center" sx={styles.heading}>
          {experienceStrings.goodAt}
        </Typography>
      </Slide>
      <Container maxWidth="lg" sx={styles.skills}>
        <Skills />
        <Slide duration={fadeDuration} direction="left" triggerOnce>
          <Link href="/cv.pdf" title="cv" target="_blank" sx={styles.cv}>
            <PictureAsPdfIcon />
            <span>{experienceStrings.cv}</span>
          </Link>
        </Slide>
      </Container>
    </Container>
  );
};

export default Experience;

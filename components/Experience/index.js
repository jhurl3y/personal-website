import React, { useEffect } from "react";
import { Fade } from "react-awesome-reveal";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { getFadeDuration } from "../../utils/helpers";
import Timeline from "./timeline";
import Skills from "./skills";
import Link from "@mui/material/Link";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { experienceStrings } from "../../utils/strings";
import Styles from "./styles";

export default () => {
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
      <Fade duration={getFadeDuration()} right>
        <Typography variant="h2" align="center" className={classes.heading}>
          {experienceStrings.experience}
        </Typography>
      </Fade>
      <Timeline />
      <Fade duration={getFadeDuration()} left>
        <Typography variant="h3" align="center" className={classes.heading}>
          {experienceStrings.goodAt}
        </Typography>
      </Fade>
      <Container maxWidth="lg" align="center" className={classes.skills}>
        <Skills />
        <Link
          href="https://cv.jameshurley.ie/"
          title="cv"
          target="_blank"
          className={classes.cv}
        >
          <PictureAsPdfIcon />
          <span>{experienceStrings.cv}</span>
        </Link>
      </Container>
    </Container>
  );
};

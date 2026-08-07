import React, { Suspense } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Skeleton } from "@mui/material";
import { Slide } from "react-awesome-reveal";
import RightRail from "./rightRail";
import { aboutStrings } from "../../utils/strings";
import styles from "./styles";
import { WIDGET_HEIGHT, fadeDuration } from "../../utils/constants";
import { Spotify } from "react-spotify-embed";

const SkeletonLoader = () => {
  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: 1,
        boxShadow: 3,
        p: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Skeleton
          variant="rectangular"
          width={60}
          height={60}
          sx={{ borderRadius: 1 }}
        />
        <Box sx={{ ml: 2, flex: 1 }}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </Box>
        <Skeleton variant="circular" width={40} height={40} />
      </Box>
      {[1, 2, 3, 4, 5].map((index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Skeleton variant="text" width={20} />
            <Box sx={{ ml: 2 }}>
              <Skeleton variant="text" width={200} />
              <Skeleton variant="text" width={150} />
            </Box>
          </Box>
          <Skeleton variant="text" width={40} />
        </Box>
      ))}
    </Box>
  );
};

const About = ({ spotify }) => {
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
                  priority={false}
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
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, sm: 12, md: 12 }} sx={styles.musicItem}>
            <Slide duration={fadeDuration} direction="right" triggerOnce>
              <Suspense fallback={<SkeletonLoader />}>
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

export default About;

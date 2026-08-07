import React, { Suspense, useState, useEffect } from "react";
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
import { getSpotifyPlaylist } from "../../utils/helpers";
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

const About = () => {
  // The playlist is no longer a prop. Under getStaticProps it would have been
  // frozen at build time, and server-rendering one playlist then swapping it
  // after mount would load two Spotify iframes per visit. Instead the server
  // renders a fixed-height skeleton and the iframe mounts exactly once, after
  // the playlist is chosen.
  const [playlist, setPlaylist] = useState(null);
  // The playlist is randomised, so it cannot be computed during render (it
  // would change on every re-render) and so useIsClient does not help. Running
  // once after hydration is the documented way to defer a client-only value,
  // and the extra render is the point: it is what keeps SSR deterministic.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlaylist(getSpotifyPlaylist());
  }, []);

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
        {/* musicContent is display:flex, so this Grid container shrank to its
            content width (300px) and the "100%" iframe had nothing to fill. */}
        <Grid container spacing={6} sx={{ width: "100%" }}>
          <Grid size={{ xs: 12, sm: 12, md: 12 }} sx={styles.musicItem}>
            <Slide duration={fadeDuration} direction="right" triggerOnce>
              {playlist === null ? (
                <Box sx={{ height: WIDGET_HEIGHT }}>
                  <SkeletonLoader />
                </Box>
              ) : (
                <Suspense fallback={<SkeletonLoader />}>
                  {/* `wide` selects Spotify's horizontal player. Without it,
                      react-spotify-embed v3 computes width = 300 and renders
                      the narrow portrait card whatever width you pass. */}
                  <Spotify
                    wide
                    link={playlist}
                    title="spotify widget"
                    height={WIDGET_HEIGHT}
                    style={{ maxWidth: 640, margin: "0 auto" }}
                  />
                </Suspense>
              )}
            </Slide>
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
};

export default About;

import Box from "@mui/material/Box";
import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { useIsClient } from "../../../utils/useIsClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { aboutStrings } from "../../../utils/strings";
import { getAge } from "../../../utils/helpers";
import { BIRTH_DATE } from "../../../utils/constants";
import styles from "./styles";

const RightRail = () => {
  // Client-only: under static generation a build-time age silently goes stale
  // on the next birthday, and computing it during SSR risks a hydration
  // mismatch when the date rolls over between build and view.
  const age = useIsClient() ? getAge(BIRTH_DATE) : null;

  const { me, intro, iLike, code, sport, travel, friends } = aboutStrings;

  // MUI 9 dropped direction="column" from Grid - it is column-subdividing by
  // design, and the docs point at Stack for vertical layouts. This was silently
  // doing nothing after the v9 upgrade.
  return (
    <Stack sx={styles.rightRail}>
      <Grid size={{ xs: 12 }}>
        <Container maxWidth={false} sx={styles.rightRailContent}>
          <Typography variant="h4">{me}</Typography>
          <p>
            {age === null
              ? intro.replace("{age} year old ", "")
              : intro.replace("{age}", String(age))}
          </p>
        </Container>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Container maxWidth={false} sx={styles.rightRailContent}>
          <Typography variant="h4">{iLike}</Typography>
          <Grid container spacing={2} sx={styles.icons}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FontAwesomeIcon icon="code" size="2x" className="highlight" />
              <Box component="p" sx={styles.skillText}>
                {code}
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FontAwesomeIcon
                icon="heartbeat"
                size="2x"
                className="highlight"
              />
              <Box component="p" sx={styles.skillText}>
                {sport}
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FontAwesomeIcon icon="train" size="2x" className="highlight" />
              <Box component="p" sx={styles.skillText}>
                {travel}
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FontAwesomeIcon icon="users" size="2x" className="highlight" />
              <Box component="p" sx={styles.skillText}>
                {friends}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Grid>
    </Stack>
  );
};

export default RightRail;

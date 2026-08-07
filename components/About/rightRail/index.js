import Box from "@mui/material/Box";
import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { aboutStrings } from "../../../utils/strings";
import { getAge } from "../../../utils/helpers";
import styles from "./styles";

const RightRail = () => {
  const { me, intro, iLike, code, sport, travel, friends } = aboutStrings;

  return (
    <Grid container direction="column" sx={styles.rightRail}>
      <Grid size={{ xs: 12 }}>
        <Container maxWidth={false} sx={styles.rightRailContent}>
          <Typography variant="h4">{me}</Typography>
          <p>{intro.replace("{age}", getAge("1994/07/14"))}</p>
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
    </Grid>
  );
};

export default RightRail;

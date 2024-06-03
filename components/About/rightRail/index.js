import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { aboutStrings } from "../../../utils/strings";
import { getAge } from "../../../utils/helpers";

const Icon = ({ icon, text }) => (
  <div>
    <FontAwesomeIcon icon={icon} size="2x" className="highlight" />
    <p sx={{ paddingRight: (theme) => theme.spacing(4) }}>{text}</p>
  </div>
);

export default () => {
  const { me, intro, iLike, code, sport, travel, friends } = aboutStrings;

  return (
    <Grid
      container
      direction="column"
      sx={{ padding: (theme) => theme.spacing(6, 6, 6, 8) }}
    >
      <Grid item xs={12}>
        <Container
          maxWidth={false}
          sx={(theme) => ({
            paddingBottom: (theme) => theme.spacing(6),
            [theme.breakpoints.down("xs")]: {
              textAlign: "center",
            },
          })}
        >
          <Typography variant="h4">{me}</Typography>
          <p>{intro.replace("{age}", getAge("1994/07/14"))}</p>
        </Container>
      </Grid>
      <Grid item xs={12}>
        <Container
          maxWidth={false}
          sx={(theme) => ({
            paddingBottom: (theme) => theme.spacing(6),
            [theme.breakpoints.down("xs")]: {
              textAlign: "center",
            },
          })}
        >
          <Typography variant="h4">{iLike}</Typography>
          <Grid
            container
            spacing={2}
            sx={{ padding: (theme) => theme.spacing(6, 0) }}
          >
            <Grid item xs={12} sm={6}>
              <Icon icon="code" text={code} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Icon icon="heartbeat" text={sport} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Icon icon="train" text={travel} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Icon icon="users" text={friends} />
            </Grid>
          </Grid>
        </Container>
      </Grid>
    </Grid>
  );
};

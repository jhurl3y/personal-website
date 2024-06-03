import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { aboutStrings } from "../../../utils/strings";
import { getAge } from "../../../utils/helpers";
import Styles from "./styles";

export default () => {
  const classes = Styles();
  const { me, intro, iLike, code, sport, travel, friends } = aboutStrings;

  return (
    <Grid container direction="column" className={classes.rightRail}>
      <Grid item xs={12}>
        <Container maxWidth={false} className={classes.rightRailContent}>
          <Typography variant="h4">{me}</Typography>
          <p>{intro.replace("{age}", getAge("1994/07/14"))}</p>
        </Container>
      </Grid>
      <Grid item xs={12}>
        <Container maxWidth={false} className={classes.rightRailContent}>
          <Typography variant="h4">{iLike}</Typography>
          <Grid container spacing={2} className={classes.icons}>
            <Grid item xs={12} sm={6}>
              <FontAwesomeIcon icon="code" size="2x" className="highlight" />
              <p className={classes.skillText}>{code}</p>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FontAwesomeIcon
                icon="heartbeat"
                size="2x"
                className="highlight"
              />
              <p className={classes.skillText}>{sport}</p>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FontAwesomeIcon icon="train" size="2x" className="highlight" />
              <p className={classes.skillText}>{travel}</p>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FontAwesomeIcon icon="users" size="2x" className="highlight" />
              <p className={classes.skillText}>{friends}</p>
            </Grid>
          </Grid>
        </Container>
      </Grid>
    </Grid>
  );
};

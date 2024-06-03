import React, { useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Fade } from "react-awesome-reveal";
import RightRail from "./rightRail";
import { getFadeDuration, getSpotifyPlaylist } from "../../utils/helpers";
import { aboutStrings } from "../../utils/strings";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import { WIDGET_HEIGHT } from "../../utils/constants";

const SpotifyWidget = () => (
  <iframe
    src={getSpotifyPlaylist()}
    width="100%"
    height={WIDGET_HEIGHT}
    frameBorder="0"
    allowtransparency="true"
    allow="encrypted-media"
  />
);

const TwitterWidget = () => (
  <TwitterTimelineEmbed
    sourceType="profile"
    screenName="hurley_19"
    options={{
      height: WIDGET_HEIGHT,
    }}
    theme="dark"
    noBorders
    noFooter
  />
);

export default () => {
  // disable radio button keydown event
  useEffect(() => {
    window.addEventListener("keydown", () => null);

    return () => {
      window.removeEventListener("keydown", () => null);
    };
  }, []);

  return (
    <Container
      sx={{
        height: "100%",
        color: "text.primary",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "background.paper",
        flexDirection: "column",
      }}
      maxWidth={false}
    >
      <Fade duration={getFadeDuration()} right>
        <Typography
          variant="h2"
          align="center"
          sx={{
            margin: (theme) => theme.spacing(9, 0, 7, 0),
            fontSize: "5rem",
          }}
        >
          {aboutStrings.about}
        </Typography>
      </Fade>
      <Container sx={{ padding: (theme) => theme.spacing(6, 0) }}>
        <Grid container>
          <Grid item sm={12} md={6}>
            <Fade duration={getFadeDuration()} left>
              <Container
                maxWidth={false}
                sx={(theme) => ({
                  paddingTop: theme.spacing(6),
                  textAlign: "center",
                  [theme.breakpoints.down("xs")]: {
                    display: "none",
                  },
                })}
              >
                <img
                  width={450}
                  alt="about"
                  src="/static/assets/images/about.png"
                />
              </Container>
            </Fade>
          </Grid>
          <Grid item sm={12} md={6}>
            <Fade duration={getFadeDuration()} right>
              <RightRail />
            </Fade>
          </Grid>
        </Grid>
      </Container>
      <Fade duration={getFadeDuration()} left>
        <Typography
          variant="h2"
          align="center"
          sx={{ margin: (theme) => theme.spacing(0, 0, 7, 0) }}
        >
          {aboutStrings.music}
        </Typography>
      </Fade>
      <Container
        sx={(theme) => ({
          margin: theme.spacing(6, 8, 10),
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          "& > .react-reveal": {
            padding: theme.spacing(3, 2),
          },
          [theme.breakpoints.down("sm")]: {
            flexDirection: "column",
            margin: theme.spacing(6, 8, 7),
          },
        })}
      >
        <Grid container spacing={6}>
          <Grid item xs={12} sm={12} md={6} sx={{ margin: "0 auto" }}>
            <Fade duration={getFadeDuration()} left>
              <SpotifyWidget />
            </Fade>
          </Grid>
          <Grid item xs={12} sm={12} md={6} sx={{ margin: "0 auto" }}>
            <Fade duration={getFadeDuration()} right>
              <TwitterWidget />
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
};

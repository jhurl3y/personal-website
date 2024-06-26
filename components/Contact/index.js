import React, { useState, useEffect, Suspense } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import { Slide } from "react-awesome-reveal";
import Styles from "./styles";
import Map from "../Map";
import { LOCATIONS } from "../../utils/constants";
import Details from "./details";
import Button from "@mui/material/Button";
import Form from "./form";
import { contactStrings } from "../../utils/strings";
import { withStyles } from "@mui/styles";
import { MAP_ZOOM, MAP_STYLES, fadeDuration } from "../../utils/constants";

const MapSkeletonLoader = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: 300,
        bgcolor: "background.paper",
        borderRadius: 1,
        boxShadow: 3,
        p: 1,
        position: "relative",
      }}
    >
      <Skeleton variant="rectangular" width="100%" height="100%" />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 4,
          bgcolor: "primary.main",
        }}
      />
    </Box>
  );
};

const StyledButton = withStyles((theme) => ({
  root: {
    color: "#46bcec",
    background: "transparent",
    textTransform: "none",
  },
}))(Button);

export default ({ formspree, maps }) => {
  const classes = Styles();
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [showDetails, setShowDetails] = useState(false);

  // disable radio button keydown event
  useEffect(() => {
    window.addEventListener("keydown", () => null);

    return () => {
      window.removeEventListener("keydown", () => null);
    };
  }, []);

  const handleGalway = () => {
    setLocation(LOCATIONS.find((location) => location.name === "galway"));
  };

  const handleSF = () => {
    setLocation(LOCATIONS.find((location) => location.name === "sf"));
  };

  return (
    <Container className={classes.container} maxWidth={false}>
      <Slide duration={fadeDuration} direction="up" triggerOnce>
        <Typography variant="h2" align="center" className={classes.heading}>
          {contactStrings.contact}
        </Typography>
        <Container className={classes.textSection} maxWidth="xs">
          <p dangerouslySetInnerHTML={{ __html: contactStrings.intro }} />
          <p dangerouslySetInnerHTML={{ __html: contactStrings.questions }} />
          <StyledButton
            href="#contact-map"
            className={classes.button}
            onClick={handleGalway}
            title={contactStrings.galway}
          >
            {contactStrings.galway}
          </StyledButton>
          {contactStrings.or}
          <StyledButton
            href="#contact-map"
            className={classes.button}
            onClick={handleSF}
            title={contactStrings.sf}
          >
            {contactStrings.sf}
          </StyledButton>
        </Container>
        <Container className={classes.formContainer} maxWidth={false}>
          <Form formspree={formspree} />
        </Container>
        <Container maxWidth="xs">
          <div className={classes.orDivider}>
            <div className={classes.orBubble}>{contactStrings.or}</div>
          </div>
        </Container>
        <Container className={classes.detailsContainer} maxWidth={false}>
          {!showDetails && (
            <Button
              color="primary"
              disableRipple
              className={classes.showButton}
              onClick={() => setShowDetails(true)}
            >
              {contactStrings.showDetails}
            </Button>
          )}
          {showDetails && <Details />}
        </Container>
      </Slide>
      <Suspense fallback={<MapSkeletonLoader />}>
        <Map
          location={location}
          zoom={MAP_ZOOM}
          mapStyles={MAP_STYLES}
          title="contact-map"
          mapClasses={classes.map}
          apiKey={maps}
        />
      </Suspense>
    </Container>
  );
};

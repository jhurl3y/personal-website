import React, { useState, Suspense } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import { Slide } from "react-awesome-reveal";
import styles from "./styles";
import Map from "../Map";
import { LOCATIONS } from "../../utils/constants";
import type { PageProps } from "../../utils/types";
import Details from "./details";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { useColorScheme } from "@mui/material/styles";
import Form from "./form";
import { contactStrings } from "../../utils/strings";
import {
  DARK_MAP_STYLES,
  EMAIL,
  MAP_ZOOM,
  MAP_STYLES,
  fadeDuration,
} from "../../utils/constants";

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

// The one withStyles HOC in the codebase, now a styled() declaration.
const StyledButton = styled(Button)(({ theme }) => ({
  // seaGlass on the deepSea section is 2.84:1, below AA. chalk is 7.12:1.
  color: theme.palette.chalk,
  background: "transparent",
  textTransform: "none",
}));

const Contact = ({ formspree, maps }: PageProps) => {
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [showDetails, setShowDetails] = useState(false);
  const { colorScheme } = useColorScheme();

  const handleGalway = () => {
    setLocation(
      LOCATIONS.find((location) => location.name === "galway") ?? LOCATIONS[0]
    );
  };

  const handleSF = () => {
    setLocation(
      LOCATIONS.find((location) => location.name === "sf") ?? LOCATIONS[0]
    );
  };

  const focusContactForm = () => {
    const form = document.getElementById("contact-form");
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    form?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "center",
    });
    form
      ?.querySelector<HTMLInputElement>("input")
      ?.focus({ preventScroll: true });
  };

  return (
    <Container sx={styles.container} maxWidth={false}>
      <Slide duration={fadeDuration} direction="up" triggerOnce>
        <Typography variant="h2" align="center" sx={styles.heading}>
          {contactStrings.contact}
        </Typography>
        <Container sx={styles.textSection} maxWidth="xs">
          <p dangerouslySetInnerHTML={{ __html: contactStrings.intro }} />
          <p>{contactStrings.questions}</p>
          <Box sx={styles.primaryActions}>
            <Button
              component="a"
              href={`mailto:${EMAIL}`}
              variant="contained"
              sx={styles.emailButton}
            >
              {contactStrings.emailMe}
            </Button>
            <Button onClick={focusContactForm} sx={styles.formButton}>
              {contactStrings.useForm}
            </Button>
          </Box>
          <StyledButton
            href="#contact-map"
            sx={styles.button}
            onClick={handleGalway}
            title={contactStrings.galway}
          >
            {contactStrings.galway}
          </StyledButton>
          {contactStrings.or}
          <StyledButton
            href="#contact-map"
            sx={styles.button}
            onClick={handleSF}
            title={contactStrings.sf}
          >
            {contactStrings.sf}
          </StyledButton>
        </Container>
        <Container sx={styles.formContainer} maxWidth={false}>
          <Form formspree={formspree} />
        </Container>
        <Container maxWidth="xs">
          <Box sx={styles.orDivider}>
            <Box sx={styles.orBubble}>{contactStrings.or}</Box>
          </Box>
        </Container>
        <Container sx={styles.detailsContainer} maxWidth={false}>
          {!showDetails && (
            <Button
              color="primary"
              disableRipple
              sx={styles.showButton}
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
          mapStyles={colorScheme === "dark" ? DARK_MAP_STYLES : MAP_STYLES}
          title="contact-map"
          mapSx={styles.map}
          apiKey={maps}
        />
      </Suspense>
    </Container>
  );
};

export default Contact;

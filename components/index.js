import React, { forwardRef, useRef, useEffect, useState } from "react";
import Layout from "./Layout";
import Home from "./Home";
import About from "./About";
import Experience from "./Experience";
import Contact from "./Contact";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { PAGES } from "../utils/constants";
import Typography from "@mui/material/Typography";
import { metaStrings } from "../utils/strings";

const rootSx = (theme) => ({
  height: "100%",
  backgroundColor: theme.palette.slate,
});

const Section = forwardRef(({ children, id, offset }, ref) => {
  let styles = offset
    ? {
        marginTop: `-${offset}px`,
        paddingTop: `${offset}px`,
      }
    : {};

  return (
    <div ref={ref} id={id} style={styles}>
      {children}
    </div>
  );
});

Section.displayName = "Section";

const Component = ({ spotify, formspree, maps }) => {
  const navRef = useRef(null);
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const experienceRef = useRef(null);
  const contactRef = useRef(null);
  const [navHeight, setNavHeight] = useState(0);

  // Bug 7.1: this previously read `navRef.clientHeight` off the ref object
  // rather than the node, so it was always undefined and every Section offset
  // was falsy - the sticky-nav scroll offset never applied. Also re-measures on
  // resize, which it never did.
  useEffect(() => {
    const measure = () => setNavHeight(navRef.current?.clientHeight ?? 0);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <Layout sx={rootSx} title={metaStrings.title}>
      <Navbar
        dark={false}
        pages={PAGES}
        navRef={navRef}
        stickyRefs={[homeRef, aboutRef, experienceRef, contactRef]}
      />
      <Section id="home" ref={homeRef}>
        <Typography variant="h1" align="center" style={{ display: "none" }}>
          {metaStrings.title}
        </Typography>
        <Home />
      </Section>
      <Section id="about" ref={aboutRef} offset={navHeight}>
        <About spotify={spotify} />
      </Section>
      <Section id="experience" ref={experienceRef} offset={navHeight}>
        <Experience />
      </Section>
      <Section id="contact" ref={contactRef} offset={navHeight}>
        <Contact formspree={formspree} maps={maps} />
      </Section>
      <Footer />
    </Layout>
  );
};

export default Component;

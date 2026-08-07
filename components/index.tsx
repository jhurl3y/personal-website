"use client";

import React, { forwardRef, useRef, useEffect, useState } from "react";
import Layout from "./Layout";
import Home from "./Home";
import About from "./About";
import Experience from "./Experience";
import Contact from "./Contact";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { PAGES } from "../utils/constants";
import type { Theme } from "@mui/material/styles";
import type { ReactNode } from "react";
import type { PageProps } from "../utils/types";

type SectionProps = {
  children?: ReactNode;
  id: string;
  offset?: number;
};

const rootSx = (theme: Theme) => ({
  height: "100%",
  backgroundColor: theme.vars!.palette.background.default,
});

const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ children, id, offset }, ref) => {
    const styles = offset
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
  }
);

Section.displayName = "Section";

const Component = ({ formspree, maps }: PageProps) => {
  const navRef = useRef<HTMLDivElement>(null);
  const homeRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
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
    <Layout sx={rootSx}>
      <Navbar
        surface="solid"
        pages={PAGES}
        navRef={navRef}
        stickyRefs={[homeRef, aboutRef, experienceRef, contactRef]}
      />
      <Section id="home" ref={homeRef}>
        <Home />
      </Section>
      <Section id="about" ref={aboutRef} offset={navHeight}>
        <About />
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

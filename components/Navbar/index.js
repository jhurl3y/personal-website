import React, { useState, useEffect } from "react";
import LogoDark from "../../public/static/assets/icons/hurley-dark.svg";
import LogoLight from "../../public/static/assets/icons/hurley-white.svg";
import Image from "next/image";
import Container from "@mui/material/Container";
import Transition from "../Transition";
import PrettyLink from "./prettyLink";
import Link from "@mui/material/Link";
import MobileMenu from "./mobileMenu";
import Styles from "./styles";
import { navbarStrings } from "../../utils/strings";

const Links = ({ selectedPage, pages, dark, classes }) => {
  const links = pages.map((page, currentIndex) => {
    const needsExtraScroll = () => {
      const selectedIsTop = pages.indexOf(selectedPage) === 0;
      const currentIsBottom = currentIndex === pages.length - 1;

      return selectedIsTop && currentIsBottom;
    };

    return (
      <PrettyLink
        key={currentIndex}
        href={`#${page}`}
        title={page}
        text={`${page}`}
        dark={dark}
        active={selectedPage === page}
        extraScroll={needsExtraScroll()}
      />
    );
  });

  return (
    <div className={classes.navigation}>
      <>
        {links}
        <Link
          key={navbarStrings.blog}
          title={navbarStrings.blog}
          href="https://blog.jameshurley.ie"
          target="_blank"
          className={`${classes.link} ${
            dark ? classes.darkLink : classes.lightLink
          }`}
        >
          {navbarStrings.blog}
        </Link>
      </>
    </div>
  );
};

export default ({ pages, dark = true, navRef = null, stickyRefs = [] }) => {
  const classes = Styles();
  const [visible, setVisible] = useState(false);
  const [page, setPage] = useState(pages[0]);
  const [offsets, setOffsets] = useState([]);
  const sticky = stickyRefs.length > 0;

  const getNewOffsets = () => {
    let newOffsets = new Array(stickyRefs.length).fill(0);

    stickyRefs.forEach((ref, i) => {
      if (ref && ref.current != undefined) {
        newOffsets[i] = ref.current.getBoundingClientRect().top;

        if (i > 0) {
          newOffsets[i] = newOffsets[i] - 40;
        }
      }
    });

    return newOffsets;
  };

  const handleScroll = () => {
    const newOffsets = getNewOffsets();
    const factorOfSafety = 10;

    if (sticky) {
      setVisible(newOffsets[0] < -factorOfSafety);
    }

    setOffsets(() => newOffsets);

    for (let i = offsets.length - 1; i >= 0; i--) {
      if (offsets[i] < factorOfSafety) {
        setPage(pages[i]);
        break;
      }
    }
  };

  useEffect(() => {
    if (!sticky) {
      return;
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [offsets, visible]);

  return (
    <Transition in={!sticky || visible} sticky={sticky}>
      <Container
        maxWidth={false}
        className={`${!dark ? classes.light : ""}`}
        ref={navRef}
      >
        <header>
          <nav className={classes.container}>
            <a className={classes.logo} href={`#${pages[0]}`} title={pages[0]}>
              {dark && <Image priority src={LogoLight} alt="logo" />}
              {!dark && <Image priority src={LogoDark} alt="logo" />}
            </a>
            <Links
              selectedPage={page}
              pages={pages}
              dark={dark}
              classes={classes}
            />
            <MobileMenu pages={pages} dark={dark} />
          </nav>
        </header>
      </Container>
    </Transition>
  );
};

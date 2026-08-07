import Box from "@mui/material/Box";
import React, { useState, useEffect } from "react";
import LogoDark from "../../public/static/assets/icons/hurley-dark.svg";
import LogoLight from "../../public/static/assets/icons/hurley-white.svg";
import Image from "next/image";
import Container from "@mui/material/Container";
import Transition from "../Transition";
import PrettyLink from "./prettyLink";
import Link from "@mui/material/Link";
import MobileMenu from "./mobileMenu";
import styles from "./styles";
import { navbarStrings } from "../../utils/strings";
import type { RefObject } from "react";

type SectionRef = RefObject<HTMLDivElement | null>;

type LinksProps = { selectedPage: string; pages: string[]; dark: boolean };

type NavbarProps = {
  pages: string[];
  dark?: boolean;
  navRef?: SectionRef | null;
  stickyRefs?: SectionRef[];
};

const Links = ({ selectedPage, pages, dark }: LinksProps) => {
  const links = pages.map((page: string, currentIndex: number) => {
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
    <Box sx={styles.navigation}>
      <>
        {links}
        <Link
          key={navbarStrings.blog}
          title={navbarStrings.blog}
          href="https://blog.jameshurley.ie"
          target="_blank"
          sx={[styles.link, dark ? styles.darkLink : styles.lightLink]}
        >
          {navbarStrings.blog}
        </Link>
      </>
    </Box>
  );
};

const Navbar = ({
  pages,
  dark = true,
  navRef = null,
  stickyRefs = [],
}: NavbarProps) => {
  const [visible, setVisible] = useState(false);
  const [page, setPage] = useState(pages[0]);
  const [offsets, setOffsets] = useState<number[]>([]);
  const sticky = stickyRefs.length > 0;

  const getNewOffsets = () => {
    const newOffsets = new Array(stickyRefs.length).fill(0);

    stickyRefs.forEach((ref: SectionRef, i: number) => {
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
        sx={!dark ? styles.light : undefined}
        ref={navRef}
      >
        <header>
          <Box component="nav" sx={styles.container}>
            <Box
              component="a"
              sx={styles.logo}
              href={`#${pages[0]}`}
              title={pages[0]}
            >
              {dark && <Image src={LogoLight} alt="logo" />}
              {!dark && <Image src={LogoDark} alt="logo" />}
            </Box>
            <Links selectedPage={page} pages={pages} dark={dark} />
            <MobileMenu pages={pages} dark={dark} />
          </Box>
        </header>
      </Container>
    </Transition>
  );
};

export default Navbar;

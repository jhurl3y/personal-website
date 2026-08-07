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
import ThemeToggle from "../ThemeToggle";
import styles from "./styles";
import { navbarStrings } from "../../utils/strings";
import type { RefObject } from "react";
import { useColorScheme } from "@mui/material/styles";

type SectionRef = RefObject<HTMLDivElement | null>;

export type NavbarSurface = "overlay" | "solid";

type LinksProps = {
  selectedPage: string;
  pages: string[];
  surface: NavbarSurface;
};

type NavbarProps = {
  pages: string[];
  surface?: NavbarSurface;
  navRef?: SectionRef | null;
  stickyRefs?: SectionRef[];
};

const Links = ({ selectedPage, pages, surface }: LinksProps) => {
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
        surface={surface}
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
          key={navbarStrings.journal}
          title={navbarStrings.journal}
          href="https://blog.jameshurley.ie"
          sx={[
            styles.link,
            surface === "overlay" ? styles.overlayLink : styles.solidLink,
          ]}
        >
          {navbarStrings.journal}
        </Link>
      </>
    </Box>
  );
};

const Navbar = ({
  pages,
  surface = "overlay",
  navRef = null,
  stickyRefs = [],
}: NavbarProps) => {
  const [visible, setVisible] = useState(false);
  const [page, setPage] = useState(pages[0]);
  const [offsets, setOffsets] = useState<number[]>([]);
  const sticky = stickyRefs.length > 0;
  const { colorScheme } = useColorScheme();
  const usesLightLogo = colorScheme === "dark";

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
        sx={surface === "solid" ? styles.solid : undefined}
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
              {usesLightLogo ? (
                <Image src={LogoLight} alt="James Hurley" />
              ) : (
                <Image src={LogoDark} alt="James Hurley" />
              )}
            </Box>
            <Links selectedPage={page} pages={pages} surface={surface} />
            <Box sx={styles.themeToggle}>
              <ThemeToggle surface={surface} />
            </Box>
            <MobileMenu pages={pages} surface={surface} />
          </Box>
        </header>
      </Container>
    </Transition>
  );
};

export default Navbar;

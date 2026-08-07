import Box from "@mui/material/Box";
import { useIsClient } from "../../utils/useIsClient";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Linkedin from "../../public/static/assets/icons/linkedin.svg";
import Github from "../../public/static/assets/icons/github.svg";
import Twitter from "../../public/static/assets/icons/twitter.svg";
import Image from "next/image";
import { footerStrings } from "../../utils/strings";
import styles from "./styles";

const Footer = () => {
  // Client-only: a build-time year goes stale on 1 January, and computing it
  // during SSR risks a hydration mismatch across midnight on New Year's Eve.
  const year = useIsClient() ? new Date().getFullYear() : null;

  return (
    <div>
      <Container sx={styles.container} maxWidth={false}>
        <Box sx={styles.social}>
          <a
            href="https://www.linkedin.com/in/jhurley1/"
            title="linkedin"
            target="_blank"
          >
            <Image src={Linkedin} width="40px" height="40px" alt="linkedin" />
          </a>
          <a href="https://github.com/jhurl3y" title="github" target="_blank">
            <Image src={Github} width="40px" height="40px" alt="github" />
          </a>
          <a
            href="https://twitter.com/hurley_19"
            title="twitter"
            target="_blank"
          >
            <Image src={Twitter} width="40px" height="40px" alt="twitter" />
          </a>
        </Box>
        <Box sx={styles.disclaimer}>
          <Typography align="center">
            {year === null
              ? ""
              : footerStrings.copyright.replace("{year}", year)}
          </Typography>
          <Typography align="center">{footerStrings.rights}</Typography>
        </Box>
      </Container>
    </div>
  );
};

export default Footer;

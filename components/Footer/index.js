import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Linkedin from "../../public/static/assets/icons/linkedin.svg";
import Github from "../../public/static/assets/icons/github.svg";
import Twitter from "../../public/static/assets/icons/twitter.svg";
import Image from "next/image";
import { footerStrings } from "../../utils/strings";
import Styles from "./styles";

export default () => {
  const classes = Styles();

  return (
    <div>
      <Container className={classes.container} maxWidth={false}>
        <div className={classes.social}>
          <a
            href="https://www.linkedin.com/in/jhurley1/"
            title="linkedin"
            target="_blank"
          >
            <Image priority src={Linkedin} width="40px" height="40px" />
          </a>
          <a href="https://github.com/jhurl3y" title="github" target="_blank">
            <Image priority src={Github} width="40px" height="40px" />
          </a>
          <a
            href="https://twitter.com/hurley_19"
            title="twitter"
            target="_blank"
          >
            <Image priority src={Twitter} width="40px" height="40px" />
          </a>
        </div>
        <div className={classes.disclaimer}>
          <Typography component="subtitle1" align="center">
            {footerStrings.copyright.replace(
              "{year}",
              new Date().getFullYear()
            )}
          </Typography>
          <Typography component="subtitle1" align="center">
            {footerStrings.rights}
          </Typography>
        </div>
      </Container>
    </div>
  );
};

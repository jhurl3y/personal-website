import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Styles from "./styles";
import { PHONE, EMAIL } from "../../../utils/constants";

export default () => {
  const classes = Styles();

  return (
    <Container maxWidth="md" align="center" className={classes.contactDetails}>
      <div className={classes.emailPhoneContainer}>
        <FontAwesomeIcon icon="envelope" size="2x" className="highlight" />
        <Typography variant="subtitle1" className={classes.emailPhone}>
          <a href={`mailto:${EMAIL}`} className={classes.mailto} title="email">
            {EMAIL}
          </a>
        </Typography>
      </div>
      <div className={classes.emailPhoneContainer}>
        <FontAwesomeIcon icon="phone" size="2x" className="highlight" />
        <Typography variant="subtitle1" className={classes.emailPhone}>
          <a href={`tel:${PHONE}`} className={classes.tel} title="phone">
            {PHONE}
          </a>
        </Typography>
      </div>
    </Container>
  );
};

import Box from "@mui/material/Box";
import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./styles";
import { PHONE, EMAIL } from "../../../utils/constants";

const ContactDetails = () => {
  return (
    <Container maxWidth="md" align="center" sx={styles.contactDetails}>
      <Box sx={styles.emailPhoneContainer}>
        <FontAwesomeIcon icon="envelope" size="2x" className="highlight" />
        <Typography sx={styles.emailPhone}>
          <Box
            component="a"
            href={`mailto:${EMAIL}`}
            sx={styles.mailto}
            title="email"
          >
            {EMAIL}
          </Box>
        </Typography>
      </Box>
      <Box sx={styles.emailPhoneContainer}>
        <FontAwesomeIcon icon="phone" size="2x" className="highlight" />
        <Typography sx={styles.emailPhone}>
          <Box
            component="a"
            href={`tel:${PHONE}`}
            sx={styles.tel}
            title="phone"
          >
            {PHONE}
          </Box>
        </Typography>
      </Box>
    </Container>
  );
};

export default ContactDetails;

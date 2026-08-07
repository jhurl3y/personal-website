import Box from "@mui/material/Box";
import React, { useState } from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { contactStrings } from "../../../utils/strings";
import { validEmailRegex } from "../../../utils/helpers";
import styles from "./styles";

const noErrors = {
  firstName: "",
  lastName: "",
  email: "",
  message: "",
};

const FALLBACK_ERROR =
  "Something went wrong sending your message. Please try again.";

const UNAVAILABLE =
  "The contact form is unavailable right now. You can reach me by email instead.";

const ContactForm = ({ formspree }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [errorFields, setErrorFields] = useState(noErrors);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDisabled = !formspree;

  const handleFieldChange = (fieldName, value) => {
    if (fieldName === "firstName") {
      setFirstName(value);
    } else if (fieldName === "lastName") {
      setLastName(value);
    } else if (fieldName === "email") {
      setEmail(value);
    } else if (fieldName === "message") {
      setMessage(value);
    }
  };

  // Bug 7.12: returns whether it actually produced a field error. It only
  // recognises "empty" and "email", so a 500 HTML body or unfamiliar JSON
  // matched neither branch and rendered nothing at all - a silent failure. The
  // caller now falls back to a generic message when this returns false.
  const handleError = (errorMessage) => {
    if (errorMessage.includes("empty")) {
      setErrorFields({
        firstName: "Can't be empty.",
        lastName: "Can't be empty.",
        email: "Can't be empty.",
        message: "Can't be empty.",
      });
      return true;
    }

    if (errorMessage.includes("email")) {
      setErrorFields({
        ...noErrors,
        email: "Oops invalid email.",
      });
      return true;
    }

    return false;
  };

  const validateFields = (fields) => {
    return new Promise((resolve, reject) => {
      let errors = {};

      // first name
      if (fields.includes("firstName")) {
        if (!firstName) {
          errors.firstName = "Can't be empty.";
        } else if (firstName.length < 3) {
          errors.firstName = "Come on, enter a real name";
        }
      }

      // last name
      if (fields.includes("lastName")) {
        if (!lastName) {
          errors.lastName = "Can't be empty.";
        } else if (lastName.length < 3) {
          errors.lastName = "Come on, enter a real name";
        }
      }

      // email
      if (fields.includes("email")) {
        if (!email) {
          errors.email = "Can't be empty.";
        } else if (!validEmailRegex.test(email)) {
          errors.email = "Email is not valid.";
        }
      }

      // message
      if (fields.includes("message")) {
        if (!message) {
          errors.message = "Can't be empty.";
        } else if (message.length < 20) {
          errors.message = "Come on, enter a proper question!";
        }
      }

      if (Object.keys(errors).length === 0) {
        resolve();
      } else {
        reject(errors);
      }
    });
  };

  const handleBlur = (fieldName) => {
    if (status !== "error") {
      return;
    }

    validateFields([fieldName])
      .then(() => {
        setErrorFields((errorFields) => {
          return {
            ...errorFields,
            [fieldName]: "",
          };
        });
      })
      .catch((errors) => {
        setStatus("error");
        setErrorFields((errorFields) => {
          return {
            ...errorFields,
            ...errors,
          };
        });
      });
  };

  const submitForm = (e) => {
    e.preventDefault();

    // Bug 7.10: with no Formspree URL the form must not post anywhere.
    if (!formspree) return;

    const form = e.target;
    const data = new FormData(form);
    const xhr = new XMLHttpRequest();

    setIsSubmitting(true);
    setSubmitError("");

    validateFields(["firstName", "lastName", "email", "message"])
      .then(() => {
        xhr.open(form.method, form.action);
        xhr.setRequestHeader("Accept", "application/json");

        // Bug 7.12: transport failure previously reached DONE with status 0 and
        // an empty responseText, so handleError("") rendered a blank error box.
        // There was no onerror either, and no submitting state.
        xhr.onerror = () => {
          setIsSubmitting(false);
          setStatus("error");
          setSubmitError(FALLBACK_ERROR);
        };

        xhr.onreadystatechange = () => {
          if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
          }

          setIsSubmitting(false);

          if (xhr.status === 200) {
            form.reset();
            setStatus("success");
            return;
          }

          setStatus("error");
          const matched = xhr.responseText
            ? handleError(xhr.responseText)
            : false;
          if (!matched) setSubmitError(FALLBACK_ERROR);
        };
        xhr.send(data);
      })
      .catch((errors) => {
        setIsSubmitting(false);
        setStatus("error");
        setErrorFields({
          ...noErrors,
          ...errors,
        });
      });
  };

  return (
    <Container maxWidth="sm" align="center" sx={styles.container}>
      <form
        noValidate
        autoComplete="off"
        onSubmit={submitForm}
        action={formspree}
        method="POST"
      >
        <Grid container>
          <Grid size={{ xs: 12, sm: 12, md: 6 }} sx={styles.textField}>
            <TextField
              fullWidth
              label={contactStrings.firstName}
              margin="normal"
              variant="filled"
              name="firstName"
              error={status === "error" && errorFields.firstName !== ""}
              helperText={status === "error" ? errorFields.firstName : ""}
              value={firstName}
              onChange={(e) => handleFieldChange("firstName", e.target.value)}
              onBlur={() => handleBlur("firstName")}
              slotProps={{ input: { sx: styles.input } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }} sx={styles.textField}>
            <TextField
              fullWidth
              label={contactStrings.lastName}
              margin="normal"
              variant="filled"
              name="lastName"
              error={status === "error" && errorFields.lastName !== ""}
              helperText={status === "error" ? errorFields.lastName : ""}
              value={lastName}
              onChange={(e) => handleFieldChange("lastName", e.target.value)}
              onBlur={() => handleBlur("lastName")}
              slotProps={{ input: { sx: styles.input } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12 }} sx={styles.textField}>
            <TextField
              fullWidth
              label={contactStrings.email}
              margin="normal"
              variant="filled"
              name="email"
              error={status === "error" && errorFields.email !== ""}
              helperText={status === "error" ? errorFields.email : ""}
              value={email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              slotProps={{ input: { sx: styles.input } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12 }} sx={styles.textField}>
            <TextField
              fullWidth
              multiline
              rows="6"
              label={contactStrings.question}
              margin="normal"
              variant="filled"
              name="message"
              error={status === "error" && errorFields.message !== ""}
              helperText={status === "error" ? errorFields.message : ""}
              value={message}
              onChange={(e) => handleFieldChange("message", e.target.value)}
              onBlur={() => handleBlur("message")}
              slotProps={{ input: { sx: styles.input } }}
            />
          </Grid>
        </Grid>
        <Box sx={styles.submit}>
          {/* Bug 7.12: there was no general error output at all, so any failure
              handleError did not recognise showed the user nothing. */}
          {submitError && (
            <p role="alert" aria-live="polite">
              {submitError}
            </p>
          )}
          {isDisabled && <p role="status">{UNAVAILABLE}</p>}
          {status === "success" ? (
            <p>{contactStrings.thanks}</p>
          ) : (
            <Button
              variant="contained"
              color="primary"
              sx={styles.button}
              type="submit"
              disabled={isDisabled || isSubmitting}
            >
              {contactStrings.send}
            </Button>
          )}
        </Box>
      </form>
    </Container>
  );
};

export default ContactForm;

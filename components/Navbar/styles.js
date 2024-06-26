import { makeStyles } from "@mui/styles";

export default makeStyles((theme) => ({
  light: {
    backgroundColor: theme.colors.white,
    boxShadow: `${theme.spacing(0)}px ${theme.spacing(6)}px ${theme.spacing(
      6
    )}px 0px rgba(0,0,0,.1)`,
  },
  container: {
    display: "flex",
    padding: theme.spacing(6, 0),
  },
  logo: {
    textDecoration: "none",
  },
  navigation: {
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
  },
  link: {
    marginRight: theme.spacing(7),
    fontSize: "1.375rem",
    textDecoration: "none",
  },
  lightLink: {
    color: theme.colors.black,
  },
  darkLink: {
    color: theme.colors.white,
  },
  [theme.breakpoints.down("sm")]: {
    navigation: {
      display: "none",
    },
  },
}));

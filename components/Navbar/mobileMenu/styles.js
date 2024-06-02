import { makeStyles } from "@mui/styles";

export default makeStyles((theme) => ({
  mobileNavigation: {
    display: "none",
    marginLeft: "auto",
  },
  menuItem: {
    color: theme.colors.black,
    textDecoration: "none",
  },
  darkMenuIcon: { color: theme.colors.black },
  lightMenuIcon: { color: theme.colors.white },
  [theme.breakpoints.down("xs")]: {
    mobileNavigation: {
      display: "block",
    },
  },
}));

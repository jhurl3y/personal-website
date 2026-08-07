import type { Theme } from "@mui/material/styles";

// sx-callback style objects. Replaces the @mui/styles makeStyles module.
// Each entry is `(theme: Theme) => ({...})`, which MUI's `sx` prop accepts directly,
// so no hook call is needed at the call site.
const styles = {
  light: (theme: Theme) => ({
    backgroundColor: theme.palette.chalk,
    boxShadow: `0px ${theme.spacing(6)} ${theme.spacing(6)} 0px rgba(0,0,0,.1)`,
  }),
  container: (theme: Theme) => ({
    display: "flex",
    padding: theme.spacing(6, 0),
  }),
  logo: () => ({ textDecoration: "none" }),
  navigation: (theme: Theme) => ({
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
    [theme.breakpoints.down("md")]: { display: "none" },
  }),
  link: (theme: Theme) => ({
    marginRight: theme.spacing(7),
    fontSize: "1.375rem",
    textDecoration: "none",
  }),
  lightLink: (theme: Theme) => ({ color: theme.palette.ink }),
  darkLink: (theme: Theme) => ({ color: theme.palette.chalk }),
};

export default styles;

import type { Theme } from "@mui/material/styles";

// sx-callback style objects. Replaces the @mui/styles makeStyles module.
// Each entry is `(theme: Theme) => ({...})`, which MUI's `sx` prop accepts directly,
// so no hook call is needed at the call site.
const styles = {
  solid: (theme: Theme) => ({
    backgroundColor: theme.palette.background.paper,
    boxShadow: `0px ${theme.spacing(6)} ${theme.spacing(6)} 0px rgba(0,0,0,.1)`,
  }),
  container: (theme: Theme) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(6, 0),
  }),
  logo: () => ({ textDecoration: "none" }),
  navigation: (theme: Theme) => ({
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    [theme.breakpoints.down("md")]: { display: "none" },
  }),
  link: (theme: Theme) => ({
    marginRight: theme.spacing(7),
    fontSize: "1.375rem",
    textDecoration: "none",
  }),
  overlayLink: (theme: Theme) => ({ color: theme.vars!.palette.text.primary }),
  solidLink: (theme: Theme) => ({ color: theme.vars!.palette.text.primary }),
  themeToggle: (theme: Theme) => ({
    display: "block",
    marginRight: theme.spacing(5),
    [theme.breakpoints.down("md")]: { display: "none" },
  }),
};

export default styles;

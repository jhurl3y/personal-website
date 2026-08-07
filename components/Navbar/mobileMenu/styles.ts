import type { Theme } from "@mui/material/styles";

// sx-callback style objects. Replaces the @mui/styles makeStyles module.
// Each entry is `(theme: Theme) => ({...})`, which MUI's `sx` prop accepts directly,
// so no hook call is needed at the call site.
const styles = {
  mobileNavigation: (theme: Theme) => ({
    display: "none",
    marginLeft: "auto",
    [theme.breakpoints.down("sm")]: { display: "block" },
  }),
  menuItem: (theme: Theme) => ({
    color: theme.palette.ink,
    textDecoration: "none",
  }),
  link: (theme: Theme) => ({
    textDecoration: "none",
    color: theme.palette.ink,
  }),
  darkMenuIcon: (theme: Theme) => ({ color: theme.palette.ink }),
  lightMenuIcon: (theme: Theme) => ({ color: theme.palette.chalk }),
};

export default styles;

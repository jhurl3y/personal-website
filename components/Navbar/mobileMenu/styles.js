// sx-callback style objects. Replaces the @mui/styles makeStyles module.
// Each entry is `(theme) => ({...})`, which MUI's `sx` prop accepts directly,
// so no hook call is needed at the call site.
const styles = {
  mobileNavigation: (theme) => ({
    display: "none",
    marginLeft: "auto",
    [theme.breakpoints.down("sm")]: { display: "block" },
  }),
  menuItem: (theme) => ({
    color: theme.palette.ink,
    textDecoration: "none",
  }),
  link: (theme) => ({ textDecoration: "none", color: theme.palette.ink }),
  darkMenuIcon: (theme) => ({ color: theme.palette.ink }),
  lightMenuIcon: (theme) => ({ color: theme.palette.chalk }),
};

export default styles;

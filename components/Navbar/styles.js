// sx-callback style objects. Replaces the @mui/styles makeStyles module.
// Each entry is `(theme) => ({...})`, which MUI's `sx` prop accepts directly,
// so no hook call is needed at the call site.
const styles = {
  light: (theme) => ({
    backgroundColor: theme.palette.chalk,
    boxShadow: `0px ${theme.spacing(6)} ${theme.spacing(6)} 0px rgba(0,0,0,.1)`,
  }),
  container: (theme) => ({ display: "flex", padding: theme.spacing(6, 0) }),
  logo: () => ({ textDecoration: "none" }),
  navigation: (theme) => ({
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
    [theme.breakpoints.down("sm")]: { display: "none" },
  }),
  link: (theme) => ({
    marginRight: theme.spacing(7),
    fontSize: "1.375rem",
    textDecoration: "none",
  }),
  lightLink: (theme) => ({ color: theme.palette.ink }),
  darkLink: (theme) => ({ color: theme.palette.chalk }),
};

export default styles;

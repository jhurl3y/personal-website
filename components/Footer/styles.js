// sx-callback style objects. Replaces the @mui/styles makeStyles module.
// Each entry is `(theme) => ({...})`, which MUI's `sx` prop accepts directly,
// so no hook call is needed at the call site.
const styles = {
  container: (theme) => ({
    height: "100%",
    color: theme.palette.chalk,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: theme.palette.slate,
    padding: theme.spacing(11),
    [theme.breakpoints.down("lg")]: { padding: theme.spacing(10) },
    [theme.breakpoints.down("md")]: { padding: theme.spacing(9) },
    [theme.breakpoints.down("sm")]: { padding: theme.spacing(8) },
  }),
  social: (theme) => ({
    display: "flex",
    justifyContent: "center",
    width: "100%",
    "& > a": { padding: theme.spacing(0, 5) },
    marginBottom: theme.spacing(6),
  }),
  disclaimer: () => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  }),
};

export default styles;

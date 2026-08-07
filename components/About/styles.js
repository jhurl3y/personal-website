// sx-callback style objects. Replaces the @mui/styles makeStyles module.
// Each entry is `(theme) => ({...})`, which MUI's `sx` prop accepts directly,
// so no hook call is needed at the call site.
const styles = {
  container: (theme) => ({
    height: "100%",
    color: theme.palette.ink,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.palette.limestone,
    flexDirection: "column",
  }),
  heading: (theme) => ({
    padding: theme.spacing(9, 0, 7, 0),
    fontSize: "5rem",
    width: "100%",
  }),
  subHeading: (theme) => ({ margin: theme.spacing(0, 0, 7, 0) }),
  aboutContent: (theme) => ({ padding: theme.spacing(6, 0) }),
  // The original declared [theme.breakpoints.down("sm")] twice at the top
  // level, so the second overwrote the first and this flexDirection rule never
  // applied. Both rules now live on the elements they target.
  musicContent: (theme) => ({
    margin: theme.spacing(6, 8, 10),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      margin: theme.spacing(6, 8, 7),
    },
  }),
  musicItem: () => ({ margin: "0 auto" }),
  imageContainer: (theme) => ({
    paddingTop: theme.spacing(6),
    textAlign: "center",
    [theme.breakpoints.down("sm")]: { display: "none" },
  }),
};

export default styles;

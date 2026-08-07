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
    backgroundColor: theme.palette.slate,
    flexDirection: "column",
  }),
  heading: (theme) => ({ padding: theme.spacing(9, 0, 8, 0) }),
  skills: (theme) => ({ paddingBottom: theme.spacing(9) }),
  cv: (theme) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: theme.palette.ink,
    "& > span": { marginLeft: theme.spacing(3) },
  }),
};

export default styles;

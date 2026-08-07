// sx-callback style objects. Replaces the @mui/styles makeStyles module.
// Each entry is `(theme) => ({...})`, which MUI's `sx` prop accepts directly,
// so no hook call is needed at the call site.
const styles = {
  rightRail: (theme) => ({ padding: theme.spacing(6, 6, 6, 8) }),
  rightRailContent: (theme) => ({
    paddingBottom: theme.spacing(6),
    [theme.breakpoints.down("sm")]: { textAlign: "center" },
  }),
  icons: (theme) => ({ padding: theme.spacing(6, 0) }),
  skillText: (theme) => ({ paddingRight: theme.spacing(4) }),
};

export default styles;

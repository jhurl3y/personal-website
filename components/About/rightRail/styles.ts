import type { Theme } from "@mui/material/styles";

// sx-callback style objects. Replaces the @mui/styles makeStyles module.
// Each entry is `(theme: Theme) => ({...})`, which MUI's `sx` prop accepts directly,
// so no hook call is needed at the call site.
const styles = {
  rightRail: (theme: Theme) => ({ padding: theme.spacing(6, 6, 6, 8) }),
  rightRailContent: (theme: Theme) => ({
    paddingBottom: theme.spacing(6),
    [theme.breakpoints.down("sm")]: { textAlign: "center" },
  }),
  icons: (theme: Theme) => ({ padding: theme.spacing(6, 0) }),
  skillText: (theme: Theme) => ({ paddingRight: theme.spacing(4) }),
};

export default styles;

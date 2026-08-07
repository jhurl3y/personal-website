import type { Theme } from "@mui/material/styles";

// sx-callback style objects. Replaces the @mui/styles makeStyles module.
// Each entry is `(theme: Theme) => ({...})`, which MUI's `sx` prop accepts directly,
// so no hook call is needed at the call site.
const styles = {
  rightRail: (theme: Theme) => ({
    padding: theme.spacing(6, 6, 6, 8),
    color: theme.vars!.palette.text.primary,
  }),
  rightRailContent: (theme: Theme) => ({
    paddingBottom: theme.spacing(6),
    [theme.breakpoints.down("sm")]: { textAlign: "center" },
  }),
  facts: (theme: Theme) => ({ marginTop: theme.spacing(5) }),
  fact: (theme: Theme) => ({
    display: "grid",
    gridTemplateColumns: "32px minmax(0, 1fr)",
    gap: theme.spacing(4),
    padding: theme.spacing(4, 0),
    borderTop: `1px solid ${theme.vars!.palette.divider}`,
    color: theme.vars!.palette.text.primary,
    "& svg": { color: theme.vars!.palette.primary.main, marginTop: "0.25rem" },
  }),
  factLabel: (theme: Theme) => ({
    margin: 0,
    color: theme.vars!.palette.primary.main,
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  }),
  factText: (theme: Theme) => ({
    margin: theme.spacing(1, 0, 0),
    color: theme.vars!.palette.text.secondary,
  }),
};

export default styles;

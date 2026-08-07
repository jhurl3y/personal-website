import type { Theme } from "@mui/material/styles";

// sx-callback style objects. Replaces the @mui/styles makeStyles module.
// Each entry is `(theme: Theme) => ({...})`, which MUI's `sx` prop accepts directly,
// so no hook call is needed at the call site.
const styles = {
  container: (theme: Theme) => ({
    height: "100%",
    color: theme.vars!.palette.chalk,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.vars!.palette.experienceSurface,
    flexDirection: "column",
  }),
  heading: (theme: Theme) => ({
    padding: theme.spacing(9, 0, 8, 0),
    width: "100%",
  }),
  skills: (theme: Theme) => ({ paddingBottom: theme.spacing(9) }),
  cv: (theme: Theme) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: theme.palette.chalk,
    "& > span": { marginLeft: theme.spacing(3) },
  }),
};

export default styles;

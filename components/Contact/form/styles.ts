import type { Theme } from "@mui/material/styles";

// sx-callback style objects. Replaces the @mui/styles makeStyles module.
// Each entry is `(theme: Theme) => ({...})`, which MUI's `sx` prop accepts directly,
// so no hook call is needed at the call site.
const styles = {
  container: (theme: Theme) => ({
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: theme.spacing(6, 0),
  }),
  textField: (theme: Theme) => ({ padding: theme.spacing(0, 3) }),
  input: (theme: Theme) => ({
    overflow: "hidden",
    color: theme.palette.ink,
    backgroundColor: `${theme.palette.chalk} !important`,
  }),
  button: (theme: Theme) => ({
    margin: `${theme.spacing(6)} auto`,
    padding: theme.spacing(3, 8),
  }),
  submit: (theme: Theme) => ({ paddingTop: theme.spacing(6) }),
};

export default styles;

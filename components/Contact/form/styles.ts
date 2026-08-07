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
    color: theme.vars!.palette.text.primary,
    backgroundColor: `${theme.vars!.palette.background.paper} !important`,
    "& .MuiInputBase-input": { color: theme.vars!.palette.text.primary },
    "& .MuiInputLabel-root": { color: theme.vars!.palette.text.secondary },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.vars!.palette.divider,
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.vars!.palette.seaGlass,
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.vars!.palette.signal,
    },
    "& input:-webkit-autofill": {
      WebkitBoxShadow: `0 0 0 100px ${theme.vars!.palette.background.paper} inset`,
      WebkitTextFillColor: theme.vars!.palette.text.primary,
    },
  }),
  button: (theme: Theme) => ({
    margin: `${theme.spacing(6)} auto`,
    padding: theme.spacing(3, 8),
  }),
  submit: (theme: Theme) => ({
    paddingTop: theme.spacing(6),
    textAlign: "center",
  }),
};

export default styles;

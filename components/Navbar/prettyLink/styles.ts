import type { Theme } from "@mui/material/styles";

// sx-callback style objects. Replaces the @mui/styles makeStyles module.
// Each entry is `(theme: Theme) => ({...})`, which MUI's `sx` prop accepts directly,
// so no hook call is needed at the call site.
const common = (theme: Theme) => ({
  marginRight: theme.spacing(7),
  fontSize: "1.375rem",
});

const styles = {
  solidLink: (theme: Theme) => ({
    ...common(theme),
    color: theme.vars!.palette.text.primary,
  }),
  overlayLink: (theme: Theme) => ({
    ...common(theme),
    color: theme.vars!.palette.text.primary,
  }),
};

export default styles;

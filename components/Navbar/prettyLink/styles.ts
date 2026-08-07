import type { Theme } from "@mui/material/styles";

// sx-callback style objects. Replaces the @mui/styles makeStyles module.
// Each entry is `(theme: Theme) => ({...})`, which MUI's `sx` prop accepts directly,
// so no hook call is needed at the call site.
const common = (theme: Theme) => ({
  marginRight: theme.spacing(7),
  fontSize: "1.375rem",
});

const styles = {
  lightLink: (theme: Theme) => ({ ...common(theme), color: theme.palette.ink }),
  darkLink: (theme: Theme) => ({
    ...common(theme),
    color: theme.palette.chalk,
  }),
};

export default styles;

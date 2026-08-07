// sx-callback style objects. Replaces the @mui/styles makeStyles module.
// Each entry is `(theme) => ({...})`, which MUI's `sx` prop accepts directly,
// so no hook call is needed at the call site.
const common = (theme) => ({
  marginRight: theme.spacing(7),
  fontSize: "1.375rem",
});

const styles = {
  lightLink: (theme) => ({ ...common(theme), color: theme.palette.ink }),
  darkLink: (theme) => ({ ...common(theme), color: theme.palette.chalk }),
};

export default styles;

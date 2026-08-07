// sx-callback style objects. Replaces the @mui/styles makeStyles module.
// Each entry is `(theme) => ({...})`, which MUI's `sx` prop accepts directly,
// so no hook call is needed at the call site.
const styles = {
  container: (theme) => ({
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: theme.spacing(6, 0),
  }),
  textField: (theme) => ({ padding: theme.spacing(0, 3) }),
  input: (theme) => ({
    overflow: "hidden",
    color: theme.palette.ink,
    backgroundColor: `${theme.palette.chalk} !important`,
  }),
  button: (theme) => ({
    margin: `${theme.spacing(6)} auto`,
    padding: theme.spacing(3, 8),
  }),
  submit: (theme) => ({ paddingTop: theme.spacing(6) }),
};

export default styles;

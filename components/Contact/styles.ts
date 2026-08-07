import type { Theme } from "@mui/material/styles";

// sx-callback style objects. Replaces the @mui/styles makeStyles module.
// Each entry is `(theme: Theme) => ({...})`, which MUI's `sx` prop accepts directly,
// so no hook call is needed at the call site.
const styles = {
  container: (theme: Theme) => ({
    height: "100%",
    color: theme.palette.chalk,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: theme.palette.deepSea,
    padding: 0,
  }),
  heading: (theme: Theme) => ({ padding: theme.spacing(9, 0, 7, 0) }),
  textSection: (theme: Theme) => ({
    padding: theme.spacing(0, 4, 3, 4),
    textAlign: "center",
  }),
  detailsContainer: (theme: Theme) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing(6),
  }),
  formContainer: (theme: Theme) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing(4),
  }),
  // Contact/index referenced styles.button (previously classes.button) which
  // was never defined, so the Galway / San Francisco links rendered unstyled.
  // TypeScript caught it; nothing else ever would have.
  button: (theme: Theme) => ({
    color: theme.palette.chalk,
    textDecoration: "underline",
    textUnderlineOffset: "0.25em",
    padding: theme.spacing(2, 3),
  }),
  showButton: (theme: Theme) => ({
    marginBottom: theme.spacing(8),
    color: theme.palette.chalk,
    padding: theme.spacing(3, 5),
    "&:hover": { backgroundColor: theme.palette.slate },
  }),
  orDivider: (theme: Theme) => ({
    borderTop: "0px",
    borderBottom: `1px solid ${theme.palette.chalk}`,
    height: "20px",
    marginBottom: "50px",
  }),
  orBubble: (theme: Theme) => ({
    backgroundColor: theme.palette.deepSea,
    color: theme.palette.chalk,
    width: "100px",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
    height: "40px",
    lineHeight: "40px",
    paddingBottom: "50px",
  }),
  map: (theme: Theme) => ({
    // The map closes the Galway -> Dublin -> San Francisco arc, so it earns
    // more height than the 40vh it had as a contact-section afterthought.
    // Capped so it never exceeds the viewport on short windows.
    height: "min(70vh, 640px)",
    width: "100%",
    borderTop: `1px solid ${theme.palette.seaGlass}`,
    [theme.breakpoints.down("md")]: { height: "min(60vh, 420px)" },
  }),
};

export default styles;

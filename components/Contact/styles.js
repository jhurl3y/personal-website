// sx-callback style objects. Replaces the @mui/styles makeStyles module.
// Each entry is `(theme) => ({...})`, which MUI's `sx` prop accepts directly,
// so no hook call is needed at the call site.
const styles = {
  container: (theme) => ({
    height: "100%",
    color: theme.palette.chalk,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: theme.palette.deepSea,
    padding: 0,
  }),
  heading: (theme) => ({ padding: theme.spacing(9, 0, 7, 0) }),
  textSection: (theme) => ({
    padding: theme.spacing(0, 4, 3, 4),
    textAlign: "center",
  }),
  detailsContainer: (theme) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing(6),
  }),
  formContainer: (theme) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing(4),
  }),
  showButton: (theme) => ({
    marginBottom: theme.spacing(8),
    color: theme.palette.chalk,
    padding: theme.spacing(3, 5),
    "&:hover": { backgroundColor: theme.palette.slate },
  }),
  orDivider: (theme) => ({
    borderTop: "0px",
    borderBottom: `1px solid ${theme.palette.chalk}`,
    height: "20px",
    marginBottom: "50px",
  }),
  orBubble: (theme) => ({
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
  map: (theme) => ({
    height: "40vh",
    width: "100%",
    [theme.breakpoints.down("lg")]: { height: "50vh" },
  }),
};

export default styles;

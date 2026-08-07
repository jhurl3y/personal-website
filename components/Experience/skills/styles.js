// sx-callback style objects. Replaces the @mui/styles makeStyles module.
// Each entry is `(theme) => ({...})`, which MUI's `sx` prop accepts directly,
// so no hook call is needed at the call site.
const styles = {
  cards: (theme) => ({
    display: "flex",
    justifyContent: "center",
    paddingBottom: theme.spacing(7),
  }),
  cardContainer: (theme) => ({
    height: "100%",
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
  }),
  card: (theme) => ({
    margin: theme.spacing(0, 6),
    height: "100%",
    "& ul": { listStyleType: "none", margin: 0, padding: 0 },
  }),
  cardTitle: () => ({ fontWeight: 600 }),
  cardContent: (theme) => ({
    padding: theme.spacing(0, 6),
    listStyleType: "none",
    color: theme.palette.mist,
    paddingBottom: theme.spacing(4),
  }),
};

export default styles;

import type { Theme } from "@mui/material/styles";

// sx-callback style objects. Replaces the @mui/styles makeStyles module.
// Each entry is `(theme: Theme) => ({...})`, which MUI's `sx` prop accepts directly,
// so no hook call is needed at the call site.
const styles = {
  cards: (theme: Theme) => ({
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "stretch",
    paddingBottom: theme.spacing(7),
  }),
  // Cards in a row have different amounts of text, so without this they each
  // size to their own content and the row ends up ragged. `height: 100%` alone
  // is not enough: react-awesome-reveal wraps every card in a div of its own,
  // and that wrapper has auto height, so the card was measuring against its own
  // content rather than the row. Every link in the chain has to stretch.
  cardCell: {
    display: "flex",
    "& > div": { display: "flex", flex: 1, width: "100%" },
  },
  cardContainer: (theme: Theme) => ({
    display: "flex",
    flex: 1,
    width: "100%",
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
  }),
  card: (theme: Theme) => ({
    margin: theme.spacing(0, 6),
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.palette.limestone,
    color: theme.palette.ink,
    borderRadius: 0,
    boxShadow: "none",
    borderTop: `2px solid ${theme.palette.seaGlass}`,
    "& ul": { listStyleType: "none", margin: 0, padding: 0 },
  }),
  cardTitle: (theme: Theme) => ({
    fontWeight: 600,
    color: theme.palette.ink,
    letterSpacing: "0.01em",
  }),
  cardContent: (theme: Theme) => ({
    padding: theme.spacing(0, 6),
    listStyleType: "none",
    color: theme.palette.mist,
    paddingBottom: theme.spacing(4),
  }),
};

export default styles;

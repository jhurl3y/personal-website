import type { Theme } from "@mui/material/styles";

// sx-callback style objects. Replaces the @mui/styles makeStyles module.
// Each entry is `(theme: Theme) => ({...})`, which MUI's `sx` prop accepts directly,
// so no hook call is needed at the call site.
const styles = {
  cards: (theme: Theme) => ({
    display: "flex",
    justifyContent: "center",
    paddingBottom: theme.spacing(7),
  }),
  cardContainer: (theme: Theme) => ({
    height: "100%",
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
  }),
  card: (theme: Theme) => ({
    margin: theme.spacing(0, 6),
    height: "100%",
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

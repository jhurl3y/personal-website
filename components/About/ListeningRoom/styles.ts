import type { Theme } from "@mui/material/styles";

const styles = {
  card: (theme: Theme) => ({
    width: "100%",
    maxWidth: 760,
    display: "grid",
    gridTemplateColumns: "minmax(132px, 0.42fr) minmax(0, 1fr)",
    overflow: "hidden",
    backgroundColor: theme.vars!.palette.background.paper,
    color: theme.vars!.palette.text.primary,
    border: `1px solid ${theme.vars!.palette.divider}`,
    [theme.breakpoints.down("sm")]: { gridTemplateColumns: "1fr" },
  }),
  artwork: (theme: Theme) => ({
    minHeight: 210,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    background:
      "radial-gradient(circle at 20% 25%, rgba(127, 168, 160, 0.92), transparent 38%), linear-gradient(135deg, #2B373B 0%, #172126 100%)",
    [theme.breakpoints.down("sm")]: { minHeight: 132 },
  }),
  artworkRule: (theme: Theme) => ({
    width: "130%",
    height: 1,
    position: "absolute",
    top: "30%",
    left: "-15%",
    backgroundColor: theme.vars!.palette.signal,
    transform: "rotate(-27deg)",
  }),
  artworkIcon: (theme: Theme) => ({
    position: "relative",
    zIndex: 1,
    color: theme.vars!.palette.chalk,
    fontSize: "4rem",
  }),
  content: (theme: Theme) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: theme.spacing(7),
    [theme.breakpoints.down("sm")]: { padding: theme.spacing(6) },
  }),
  eyebrow: (theme: Theme) => ({
    margin: 0,
    color: theme.vars!.palette.primary.main,
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "0.14em",
    lineHeight: 1.5,
    textTransform: "uppercase",
  }),
  title: (theme: Theme) => ({
    margin: theme.spacing(2, 0),
    color: theme.vars!.palette.text.primary,
  }),
  description: (theme: Theme) => ({
    margin: 0,
    color: theme.vars!.palette.text.secondary,
    maxWidth: "42ch",
  }),
  actions: (theme: Theme) => ({
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: theme.spacing(3),
    marginTop: theme.spacing(5),
  }),
  primaryAction: (theme: Theme) => ({
    color: theme.vars!.palette.chalk,
    backgroundColor: theme.vars!.palette.primary.main,
    textTransform: "none",
    "&:hover": { backgroundColor: theme.vars!.palette.deepSea },
  }),
  secondaryAction: (theme: Theme) => ({
    color: theme.vars!.palette.text.primary,
    textDecoration: "underline",
    textUnderlineOffset: "0.24em",
    textTransform: "none",
    "&:focus-visible": {
      outline: `3px solid ${theme.vars!.palette.signal}`,
      outlineOffset: 2,
    },
  }),
  playerCollapse: () => ({ gridColumn: "1 / -1" }),
  player: (theme: Theme) => ({
    padding: theme.spacing(0, 6, 6),
    "& iframe": {
      display: "block",
      width: "100% !important",
      maxWidth: 640,
      margin: "0 auto",
    },
  }),
};

export default styles;

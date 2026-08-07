import type { Theme } from "@mui/material/styles";

// Spreading theme.typography.* into sx drags in its @font-face array, which is
// not a valid style object. These mirror the theme's display/overline variants.
const FALLBACK = 'system-ui, -apple-system, "Segoe UI", sans-serif';

const DISPLAY = {
  fontFamily: `var(--font-display), ${FALLBACK}`,
  fontWeight: 700,
  letterSpacing: "-0.01em",
};

const OVERLINE = {
  fontFamily: `var(--font-body), ${FALLBACK}`,
  fontVariantNumeric: "tabular-nums" as const,
  letterSpacing: "0.12em",
  fontSize: "0.8125rem",
  fontWeight: 600,
  lineHeight: 1.6,
};

// sx-callback style objects. Replaces the @mui/styles makeStyles module.
// Each entry is `(theme: Theme) => ({...})`, which MUI's `sx` prop accepts directly,
// so no hook call is needed at the call site.
// The aspect-ratio queries have no theme.breakpoints equivalent, so they stay
// as raw media queries - now nested inside the rule they modify rather than
// declared as sibling top-level keys the way JSS required.
const styles = {
  outer: (theme: Theme) => ({
    height: "100vh",
    backgroundRepeat: "no-repeat",
    position: "relative",
    width: "100%",
    margin: `${theme.spacing(0)} auto`,
    overflow: "hidden",
    whiteSpace: "nowrap",
    "@media (max-aspect-ratio: 3/2)": {
      backgroundPosition: "center top",
      backgroundSize: "auto 100%",
    },
    "@media (min-aspect-ratio: 3/2)": {
      backgroundPosition: "center top",
      backgroundSize: "auto 120%",
    },
    "@media (min-aspect-ratio: 2/1)": {
      backgroundPosition: "center center",
      backgroundSize: "auto 150%",
    },
    "@media (min-aspect-ratio: 5/2)": {
      backgroundPosition: "center center",
      backgroundSize: "auto 200%",
    },
    "@media (min-aspect-ratio: 3/1)": {
      backgroundPosition: "center center",
      backgroundSize: "auto 250%",
    },
    "@media (min-aspect-ratio: 7/2)": {
      backgroundPosition: "center center",
      backgroundSize: "auto 300%",
    },
  }),
  slider: () => ({ position: "relative", height: "100%", width: "100%" }),
  image: () => ({ display: "inline-block", height: "100%", width: "100%" }),
  content: () => ({
    position: "absolute",
    height: "100%",
    width: "100%",
    top: "0",
  }),
  // The hero copy sits left of centre so the name never lands on the horizon
  // line in the photographs, which is roughly centred in most of them.
  heroCopy: (theme: Theme) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    // Sits in the lower third rather than centred: the photographs all put
    // their subject and horizon around the middle, so centred type lands on
    // top of both. Low also means the copy falls on darker ground in most of
    // them, which is where the overlay is legible without a scrim.
    justifyContent: "flex-end",
    height: "100%",
    paddingBottom: theme.spacing(9),
    color: theme.palette.chalk,
    textShadow: "0 1px 24px rgba(0,0,0,0.55)",
  }),
  eyebrow: (theme: Theme) => ({
    ...OVERLINE,
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(4),
    color: theme.palette.seaGlass,
    marginBottom: theme.spacing(5),
    flexWrap: "wrap",
  }),
  // A short rule standing in for the route line that runs the rest of the page.
  eyebrowRule: (theme: Theme) => ({
    display: "inline-block",
    width: theme.spacing(8),
    height: "1px",
    backgroundColor: theme.palette.seaGlass,
  }),
  coords: () => ({
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "pre",
  }),
  place: (theme: Theme) => ({
    color: theme.palette.chalk,
    opacity: 0.85,
  }),
  name: (theme: Theme) => ({
    ...DISPLAY,
    margin: 0,
    lineHeight: 0.86,
    fontSize: "clamp(3.5rem, 11vw, 9rem)",
    color: theme.palette.chalk,
  }),
  role: (theme: Theme) => ({
    ...OVERLINE,
    marginTop: theme.spacing(5),
    color: theme.palette.chalk,
    letterSpacing: "0.16em",
  }),
  home: (theme: Theme) => ({
    height: "100%",
    color: theme.palette.chalk,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    filter: "unset",
    paddingBottom: "10%",
  }),
  dots: (theme: Theme) => ({
    position: "absolute",
    left: "50%",
    bottom: theme.spacing(6),
    transform: "translate(-50%, -50%)",
    margin: "0 auto",
    fontSize: "1.125rem",
  }),
  dotContainer: () => ({ minWidth: "0px" }),
  dot: () => ({
    height: "15px",
    width: "15px",
    borderRadius: "50%",
    display: "inline-block",
  }),
};

export default styles;

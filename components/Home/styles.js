// sx-callback style objects. Replaces the @mui/styles makeStyles module.
// Each entry is `(theme) => ({...})`, which MUI's `sx` prop accepts directly,
// so no hook call is needed at the call site.
// The aspect-ratio queries have no theme.breakpoints equivalent, so they stay
// as raw media queries - now nested inside the rule they modify rather than
// declared as sibling top-level keys the way JSS required.
const styles = {
  outer: (theme) => ({
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
  home: (theme) => ({
    height: "100%",
    color: theme.palette.chalk,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    filter: "unset",
    paddingBottom: "10%",
  }),
  dots: (theme) => ({
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

import { createTheme, responsiveFontSizes } from "@mui/material";

// Atlantic palette. Every ratio below is computed, not estimated - two earlier
// drafts of the spec got these wrong.
//
//   ink        on limestone  14.83:1  AAA
//   chalk      on slate      11.73:1  AAA
//   deepSea    on limestone   5.87:1  AA   <- links on light surfaces
//   signalText on limestone   5.21:1  AA   <- accent text on light surfaces
//   seaGlass   on slate       4.68:1  AA   <- accent on dark surfaces ONLY
//   signal     on slate       3.33:1       <- decorative marks only, never text
//   seaGlass   on limestone   2.07:1  FAIL <- never use; deepSea instead
//   signal     on limestone   2.90:1  FAIL <- never use for anything meaningful
const ATLANTIC = {
  slate: "#2B373B",
  limestone: "#E8E4DC",
  ink: "#14110F",
  chalk: "#FAFAF8",
  seaGlass: "#7FA8A0",
  deepSea: "#2F5D57",
  signal: "#E4572E",
  signalText: "#A33A1B",
  // Muted body text on light surfaces. 5.82:1 on limestone, so it passes AA
  // where the old #888888 it replaces did not (2.9:1).
  mist: "#4A585D",
};

const FALLBACK = 'system-ui, -apple-system, "Segoe UI", sans-serif';
const BODY_STACK = `var(--font-body), ${FALLBACK}`;
const DISPLAY_STACK = `var(--font-display), ${FALLBACK}`;

const DISPLAY = {
  fontFamily: DISPLAY_STACK,
  fontWeight: 700,
  letterSpacing: "-0.005em",
};

const theme = responsiveFontSizes(
  createTheme({
    spacing: (factor: number) =>
      [0, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128][factor],
    typography: {
      fontSize: 16,
      fontFamily: BODY_STACK,
      // Display variants use Archivo at the expanded end of its wdth axis.
      // `axes: ["wdth"]` only loads the axis; font-stretch is what applies it.
      h1: DISPLAY,
      h2: DISPLAY,
      h3: DISPLAY,
      h4: { ...DISPLAY, fontWeight: 600 },
      // Coordinates, dates and the skills grid line up on tabular figures.
      overline: {
        fontFamily: BODY_STACK,
        fontVariantNumeric: "tabular-nums",
        letterSpacing: "0.12em",
        fontSize: "0.8125rem",
        fontWeight: 600,
        lineHeight: 1.6,
      },
    },
    palette: {
      ...ATLANTIC,
      primary: { main: ATLANTIC.deepSea },
      secondary: { main: ATLANTIC.seaGlass },
      background: { default: ATLANTIC.limestone },
      text: { primary: ATLANTIC.ink },
    },
  })
);

export default theme;

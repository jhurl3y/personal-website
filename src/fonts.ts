import { Archivo, Source_Sans_3 } from "next/font/google";

/**
 * Display face.
 *
 * The Atlantic direction originally called for Archivo at the expanded end of
 * its `wdth` axis. Loading the variable font to get that axis costs 87 KB
 * against 14 KB for the static 700 - 116 KB served in total versus 42 KB, over
 * the 90 KB budget. The static instance wins: 74 KB is a real cost to a visitor
 * and the width difference is subtle at display sizes. `font-stretch` would be
 * inert here, so it is not set.
 */
export const display = Archivo({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  variable: "--font-display",
});

/**
 * Body and data face. Coordinates and dates use `font-variant-numeric:
 * tabular-nums` on this rather than pulling in a third family.
 */
export const body = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-body",
});

export const fontVariables = `${display.variable} ${body.variable}`;

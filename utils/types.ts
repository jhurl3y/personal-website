import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";

/**
 * A style entry from one of the `styles.ts` modules. They are `(theme) => ({})`
 * callbacks, which is exactly what MUI's `sx` prop accepts, so components can
 * pass them straight through without a hook call.
 */
export type SxEntry = SxProps<Theme>;

/** A hero carousel slide. */
export type HeroImage = {
  id: string;
  alt: string;
  location: string;
  /** Display-formatted lat/long, e.g. "33.9628°S  18.4098°E". */
  coords: string;
  desktopSrc: string;
};

/**
 * Absent env values are `null`, never `""`. The distinction matters: the
 * contact form and the map each degrade on `null`, and an empty string would
 * silently look like a configured-but-blank value.
 */
export type FormspreeUrl = string | null;
export type MapsKey = string | null;

/** Props threaded from getStaticProps through to the section components. */
export type PageProps = {
  formspree: FormspreeUrl;
  maps: MapsKey;
};

export type WithChildren = { children?: ReactNode };

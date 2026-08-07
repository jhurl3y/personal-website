import "@mui/material/styles";

// Atlantic palette tokens. Without this augmentation every `theme.palette.slate`
// access is a type error, since they are not part of MUI's default Palette.
declare module "@mui/material/styles" {
  interface Palette {
    slate: string;
    limestone: string;
    ink: string;
    chalk: string;
    seaGlass: string;
    deepSea: string;
    signal: string;
    signalText: string;
    mist: string;
    night: string;
    nightRaised: string;
    nightMuted: string;
    aboutSurface: string;
    experienceSurface: string;
    contactSurface: string;
    cardSurface: string;
  }

  interface PaletteOptions {
    slate?: string;
    limestone?: string;
    ink?: string;
    chalk?: string;
    seaGlass?: string;
    deepSea?: string;
    signal?: string;
    signalText?: string;
    mist?: string;
    night?: string;
    nightRaised?: string;
    nightMuted?: string;
    aboutSurface?: string;
    experienceSurface?: string;
    contactSurface?: string;
    cardSurface?: string;
  }
}

import { fadeDuration } from "./constants";
import { shuffle } from "./array";
import {
  HERO_IMAGES,
  NUMBER_OF_IMAGES,
  SPOTIFY_PLAYLISTS,
  FORMSPREE_URL,
} from "./constants";

export const getFadeDuration = () => fadeDuration;

export const getSpotifyPlaylist = () => shuffle(SPOTIFY_PLAYLISTS)[0];

// Bug 7.7: this used to branch on react-device-detect's `isBrowser`, which
// reports server-vs-browser, NOT desktop-vs-mobile - so the image set was
// chosen by render environment rather than viewport.
//
// Bug 7.9: the old getBackground() fetched each image and handed back a
// URL.createObjectURL blob that was never revoked. It leaked, and it bypassed
// next/image entirely. Gone - next/image fetches these directly now.
//
// There is no desktop/mobile split any more: the two S3 buckets hold unrelated
// photo sets rather than crops of the same shots, so serving the mobile one
// would show different photographs than the alt text describes. next/image
// handles sizing from the single source.
export const getHeroSlides = () => {
  const [first, ...rest] = HERO_IMAGES;
  return [first, ...shuffle(rest).slice(0, NUMBER_OF_IMAGES)];
};

export const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

// Bug 7.6: this used to call `tokens.split(",")` unguarded, so an unset
// FORMSPREE_TOKENS threw inside data fetching and 500'd the whole page.
// Returns null instead, and the contact form renders disabled (bug 7.10).
export const getFormspreeUrl = () => {
  const tokens = process.env.FORMSPREE_TOKENS;
  if (!tokens) return null;

  const list = tokens.split(",").filter(Boolean);
  if (list.length === 0) return null;

  return `${FORMSPREE_URL}/${shuffle(list)[0]}`;
};

// Bug 7.10: null rather than undefined, so the absent case is explicit and the
// map renders a static fallback instead of mounting the Google loader.
export const getGoogleMapsKey = () => process.env.GOOGLE_MAPS_API_KEY || null;

export const getAge = (dateString: string): number => {
  const today = new Date();
  const birthDate = new Date(dateString);
  const m = today.getMonth() - birthDate.getMonth();
  let age = today.getFullYear() - birthDate.getFullYear();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

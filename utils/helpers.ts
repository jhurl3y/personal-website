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
// chosen by render environment rather than viewport. Art direction now happens
// in the markup via <picture>, and this only decides which images appear.
//
// Bug 7.9: the old getBackground() fetched each image and handed back a
// URL.createObjectURL blob that was never revoked. It leaked, and it bypassed
// next/image entirely. Gone - next/image fetches these directly now.
export const getHeroSlides = () => {
  const [first, ...rest] = HERO_IMAGES;
  const selectable = rest.filter((image) => image.mobileSrc);
  return [first, ...shuffle(selectable).slice(0, NUMBER_OF_IMAGES)];
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

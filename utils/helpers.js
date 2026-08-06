import { isBrowser } from "react-device-detect";
import { fadeDuration } from "./constants";
import { shuffle } from "./array";
import {
  BACKGROUNDS,
  MOBILE_BACKGROUNDS,
  NUMBER_OF_IMAGES,
  DESKTOP_IMAGE_PATH,
  MOBILE_IMAGE_PATH,
  SPOTIFY_PLAYLISTS,
  FORMSPREE_URL,
} from "./constants";

export const getFadeDuration = () => fadeDuration;

export const getBackground = async (backgroundUrl) => {
  const response = await fetch(backgroundUrl);
  const image = await response.blob();
  return URL.createObjectURL(image);
};

export const getSpotifyPlaylist = () => shuffle(SPOTIFY_PLAYLISTS)[0];

export const getBackgroundUrls = () =>
  isBrowser
    ? shuffle(BACKGROUNDS)
        .slice(0, NUMBER_OF_IMAGES)
        .map((background) => `${DESKTOP_IMAGE_PATH}${background}.jpg`)
    : shuffle(MOBILE_BACKGROUNDS).map(
        (background) => `${MOBILE_IMAGE_PATH}${background}.jpg`
      );

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

export const getAge = (dateString) => {
  const today = new Date();
  const birthDate = new Date(dateString);
  const m = today.getMonth() - birthDate.getMonth();
  let age = today.getFullYear() - birthDate.getFullYear();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

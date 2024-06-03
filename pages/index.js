import React from "react";
import dynamic from "next/dynamic";
import {
  getFormspreeUrl,
  getSpotifyPlaylist,
  getGoogleMapsKey,
} from "../utils/helpers";
import App from "../components";

export async function getServerSideProps() {
  return {
    props: {
      formspree: getFormspreeUrl(),
      spotify: getSpotifyPlaylist(),
      maps: getGoogleMapsKey(),
    },
  };
}

export default function Page(data) {
  return <App {...data} />;
}

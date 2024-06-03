import React from "react";
import dynamic from "next/dynamic";
import { getFormspreeUrl, getSpotifyPlaylist } from "../utils/helpers";

const App = dynamic(() => import("../components"), { ssr: true });

export async function getServerSideProps() {
  return {
    props: { formspree: getFormspreeUrl(), spotify: getSpotifyPlaylist() },
  };
}

export default function Page(data) {
  return <App {...data} />;
}

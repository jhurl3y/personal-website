import React from "react";
import { getFormspreeUrl, getGoogleMapsKey } from "../utils/helpers";
import App from "../components";
import type { PageProps } from "../utils/types";

// getServerSideProps existed only to read two env vars, which forced SSR on
// every request for a page whose content is static and defeated CDN caching.
//
// `spotify` is deliberately absent: passing it here would pin the playlist to
// the deployment. It is chosen client-side after mount instead (see About).
//
// The Formspree token IS frozen per deploy, and that is accepted. The rotation
// exists to spread submissions across free-tier quotas; rotating client-side
// would mean shipping every token to the browser, which is strictly worse.
export async function getStaticProps(): Promise<{ props: PageProps }> {
  return {
    props: {
      formspree: getFormspreeUrl(),
      maps: getGoogleMapsKey(),
    },
  };
}

export default function Page(data: PageProps) {
  return <App {...data} />;
}

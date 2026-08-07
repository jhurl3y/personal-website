import React from "react";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@mui/material/styles";
// Interim only. Bug 7.3 correctly moves ThemeProvider to @mui/material/styles,
// but @mui/styles' makeStyles reads from its OWN context, so the surviving JSS
// modules lose `theme.colors` and throw. Both providers are needed until Task 6
// deletes @mui/styles; this import goes with it.
import { ThemeProvider as JssThemeProvider } from "@mui/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../src/theme";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCode,
  faHeartbeat,
  faTrain,
  faUsers,
  faEnvelope,
  faPhone,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import "react-vertical-timeline-component/style.min.css";
import { metaStrings } from "../utils/strings";
import "../src/styles.css";

// Bug 7.5: this ran inside the component body, so it re-registered every icon
// on every render. The library is global and idempotent - module scope is where
// it belongs.
library.add(
  faCode,
  faHeartbeat,
  faTrain,
  faUsers,
  faEnvelope,
  faPhone,
  faArrowLeft,
  faArrowRight
);

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>{metaStrings.title}</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/static/favicon_io/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/static/favicon_io/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/static/favicon_io/favicon-16x16.png"
        />
        <link rel="manifest" href="/static/favicon_io/site.webmanifest" />
        <meta charSet="utf-8" />
        <meta name="title" content={metaStrings.title} />
        <meta name="description" content={metaStrings.description} />
        <meta name="keywords" content={metaStrings.keywords} />
        <meta name="author" content={metaStrings.author} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={metaStrings.url}></link>

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content={metaStrings.twitterSite} />
        <meta name="twitter:title" content={metaStrings.title} />
        <meta name="twitter:description" content={metaStrings.description} />
        <meta
          name="twitter:image:src"
          content={`${metaStrings.url}/static/assets/images/about_meta.png`}
        />
        <meta
          name="twitter:image"
          content={`${metaStrings.url}/static/assets/images/about_meta.png`}
        />
        <meta name="twitter:image:width" content="300" />
        <meta name="twitter:image:height" content="349" />
        {/* Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaStrings.title} />
        <meta property="og:site_name" content={metaStrings.title} />
        <meta property="og:description" content={metaStrings.description} />
        <meta
          property="og:image"
          content={`${metaStrings.url}/static/assets/images/about_meta.png`}
        />
        <meta property="og:image:width" content="300" />
        <meta property="og:image:height" content="349" />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:url" content={metaStrings.url}></meta>
      </Head>
      <ThemeProvider theme={theme}>
        {/* JssThemeProvider is interim scaffolding for the remaining
            @mui/styles modules; it is removed in Task 6 with @mui/styles. */}
        <JssThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...pageProps} />
          <SpeedInsights />
          <Analytics />
        </JssThemeProvider>
      </ThemeProvider>
    </>
  );
}

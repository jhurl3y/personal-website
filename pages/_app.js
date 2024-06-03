import React from "react";
import Head from "next/head";
import { ThemeProvider } from "@mui/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../src/theme";
const { library } = require("@fortawesome/fontawesome-svg-core");
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

export default function MyApp({ Component, pageProps }) {
  // add icons
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
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

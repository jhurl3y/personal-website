import React from "react";
import Head from "next/head";
import { ThemeProvider } from "@mui/styles";
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
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

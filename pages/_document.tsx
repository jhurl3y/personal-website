import React from "react";
import Document, { Head, Main, NextScript, Html } from "next/document";
import type { DocumentProps } from "next/document";
import type { DocumentHeadTagsProps } from "@mui/material-nextjs/v16-pagesRouter";
import {
  DocumentHeadTags,
  documentGetInitialProps,
} from "@mui/material-nextjs/v16-pagesRouter";
import { fontVariables } from "../src/fonts";

class MyDocument extends Document<DocumentProps & DocumentHeadTagsProps> {
  render() {
    return (
      <Html lang="en" className={fontVariables}>
        <Head>
          <DocumentHeadTags {...this.props} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// Emotion SSR via MUI's documented Pages Router integration. This replaces the
// legacy JSS ServerStyleSheets collection, which went with @mui/styles. No
// custom cache is passed: the package's default is used on both sides, so the
// server and browser cache keys cannot drift apart.
MyDocument.getInitialProps = async (ctx) => await documentGetInitialProps(ctx);

export default MyDocument;

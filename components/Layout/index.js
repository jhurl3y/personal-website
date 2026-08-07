import React from "react";
import Head from "next/head";
import Box from "@mui/material/Box";

const Layout = ({ children, title, sx }) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="utf-8" />
    </Head>
    <Box sx={sx}>{children}</Box>
    <style jsx global>{`
      html {
        height: 100%;
        scroll-behavior: smooth;
      }
      body {
        min-height: 100%;
      }
      @media (prefers-reduced-motion: reduce) {
        html {
          scroll-behavior: auto;
        }
      }
    `}</style>
  </div>
);

export default Layout;

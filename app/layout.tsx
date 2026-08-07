import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { fontVariables } from "../src/fonts";
import Providers from "./providers";
import { metaStrings } from "../utils/strings";
import "react-vertical-timeline-component/style.min.css";
import "../src/styles.css";

// The FontAwesome library is registered in providers.tsx, not here - it has to
// run on the client to survive hydration. See the comment there.

const OG_IMAGE = `${metaStrings.url}/static/assets/images/about_meta.png`;

// Replaces the hand-written <Head> from the Pages Router. Next builds the tags
// from this, which means no more duplicated title/description strings and no
// risk of the og: and twitter: sets drifting apart.
export const metadata: Metadata = {
  metadataBase: new URL(metaStrings.url),
  title: metaStrings.title,
  description: metaStrings.description,
  keywords: metaStrings.keywords,
  authors: [{ name: metaStrings.author }],
  alternates: { canonical: metaStrings.url },
  manifest: "/static/favicon_io/site.webmanifest",
  icons: {
    icon: [
      {
        url: "/static/favicon_io/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/static/favicon_io/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: [
      { url: "/static/favicon_io/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
  openGraph: {
    type: "website",
    title: metaStrings.title,
    siteName: metaStrings.title,
    description: metaStrings.description,
    url: metaStrings.url,
    locale: "en_GB",
    images: [{ url: OG_IMAGE, width: 300, height: 349 }],
  },
  twitter: {
    card: "summary",
    site: metaStrings.twitterSite,
    title: metaStrings.title,
    description: metaStrings.description,
    images: [OG_IMAGE],
  },
};

// `viewport` is its own export in the App Router; leaving it in `metadata`
// is deprecated and silently ignored.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The font variables must sit on <html>: CssBaseline sets font-family on
    // body, and custom properties defined lower down are out of scope there.
    <html lang="en" className={fontVariables}>
      <body>
        <Providers>
          {children}
          <SpeedInsights />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}

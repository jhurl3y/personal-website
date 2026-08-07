"use client";

import type { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
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
import theme from "../src/theme";

// This has to run on the CLIENT, which is why it lives here and not in
// layout.tsx. `<FontAwesomeIcon icon="arrow-left" />` resolves that string
// against this global library at render time. layout.tsx is a server
// component, so registering there only populated the library during SSR: the
// markup came out correct and then hydration, finding an empty library in the
// browser, rendered nothing and the icons vanished. In the Pages Router
// _app.tsx ran in both places, which is why this survived the migration
// unnoticed.
//
// Module scope, not the component body - the library is global and idempotent,
// and registering per render re-registered every icon on every render.
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

/**
 * The theme carries functions (`breakpoints.up`, `spacing`, …), and a server
 * component cannot hand a function to a client component - the build fails
 * with "Functions cannot be passed directly to Client Components". So the
 * theme has to be imported on the client side of the boundary rather than
 * passed across it, which is why this exists instead of the providers sitting
 * directly in layout.tsx.
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}

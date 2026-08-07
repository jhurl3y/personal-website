"use client";

import type { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../src/theme";

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

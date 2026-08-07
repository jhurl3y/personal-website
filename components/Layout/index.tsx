import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";
import React from "react";
import Box from "@mui/material/Box";

type LayoutProps = {
  children?: ReactNode;
  sx?: SxProps<Theme>;
};

/**
 * Page shell. The title, viewport and charset it used to render through
 * next/head are now declared by the `metadata` and `viewport` exports in
 * app/layout.tsx - next/head does not exist in the App Router - and the global
 * html/body rules moved to src/styles.css.
 */
const Layout = ({ children, sx }: LayoutProps) => <Box sx={sx}>{children}</Box>;

export default Layout;

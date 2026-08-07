"use client";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { useColorScheme } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";

export type ThemeToggleSurface = "overlay" | "solid";

type ThemeToggleProps = { surface?: ThemeToggleSurface };

const buttonSx = (surface: ThemeToggleSurface) => (theme: Theme) => ({
  width: 44,
  height: 44,
  color: theme.vars!.palette.text.primary,
  border: `1px solid ${theme.vars!.palette.divider}`,
  "&:hover": {
    backgroundColor:
      surface === "overlay"
        ? "color-mix(in srgb, var(--james-hurley-palette-background-paper) 60%, transparent)"
        : theme.palette.action.hover,
  },
  "&:focus-visible": {
    outline: `3px solid ${theme.palette.signal}`,
    outlineOffset: 3,
  },
});

const ThemeToggle = ({ surface = "solid" }: ThemeToggleProps) => {
  const { colorScheme, setMode } = useColorScheme();
  const isDark = colorScheme === "dark";
  const action = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <Tooltip title={action}>
      <span>
        <IconButton
          aria-label={action}
          disabled={!colorScheme}
          onClick={() => setMode(isDark ? "light" : "dark")}
          sx={buttonSx(surface)}
        >
          {isDark ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default ThemeToggle;

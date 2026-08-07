import Box from "@mui/material/Box";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import SmoothAnchor from "../smoothAnchor";
import styles from "./styles";
import Link from "@mui/material/Link";
import { navbarStrings } from "../../../utils/strings";
import ThemeToggle from "../../ThemeToggle";
import type { NavbarSurface } from "..";

const MobileMenu = ({
  pages,
  surface,
}: {
  pages: string[];
  surface: NavbarSurface;
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={styles.mobileNavigation}>
      <IconButton
        aria-label="more"
        aria-controls="hamburger-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MenuIcon
          sx={
            surface === "overlay"
              ? styles.overlayMenuIcon
              : styles.solidMenuIcon
          }
        />
      </IconButton>
      <Menu
        id="hamburger-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {pages.map((page: string, i: number) => (
          <SmoothAnchor
            key={i}
            href={`#${page}`}
            title={page}
            sx={styles.menuItem}
          >
            <MenuItem key={i} onClick={handleClose}>
              {page}
            </MenuItem>
          </SmoothAnchor>
        ))}
        <Link
          key={navbarStrings.journal}
          title={navbarStrings.journal}
          href="https://blog.jameshurley.ie"
          sx={styles.link}
        >
          <MenuItem key={navbarStrings.journal} onClick={handleClose}>
            {navbarStrings.journal}
          </MenuItem>
        </Link>
        <MenuItem disableRipple sx={styles.themeMenuItem}>
          <ThemeToggle />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MobileMenu;

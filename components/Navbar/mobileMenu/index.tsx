import Box from "@mui/material/Box";
import { useState } from "react";
import IconButton from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import SmoothAnchor from "../smoothAnchor";
import styles from "./styles";
import Link from "@mui/material/Link";
import { navbarStrings } from "../../../utils/strings";

const MobileMenu = ({ pages, dark }: { pages: string[]; dark: boolean }) => {
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
        <MenuIcon sx={!dark ? styles.darkMenuIcon : styles.lightMenuIcon} />
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
          key={navbarStrings.blog}
          title={navbarStrings.blog}
          href="https://blog.jameshurley.ie"
          target="_blank"
          sx={styles.link}
        >
          <MenuItem key={navbarStrings.blog}>{navbarStrings.blog}</MenuItem>
        </Link>
      </Menu>
    </Box>
  );
};

export default MobileMenu;

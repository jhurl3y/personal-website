import { useState } from "react";
import IconButton from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import SmoothAnchor from "../smoothAnchor";
import Styles from "./styles";
import Link from "@mui/material/Link";
import { navbarStrings } from "../../../utils/strings";

export default ({ pages, dark }) => {
  const classes = Styles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.target);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.mobileNavigation}>
      <IconButton
        aria-label="more"
        aria-controls="hamburger-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MenuIcon
          className={!dark ? classes.darkMenuIcon : classes.lightMenuIcon}
        />
      </IconButton>
      <Menu
        id="hamburger-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {pages.map((page, i) => (
          <SmoothAnchor
            key={i}
            href={`#${page}`}
            title={page}
            className={classes.menuItem}
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
          className={classes.link}
        >
          <MenuItem key={navbarStrings.blog}>{navbarStrings.blog}</MenuItem>
        </Link>
      </Menu>
    </div>
  );
};

import { useState } from "react";
import IconButton from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import SmoothAnchor from "../smoothAnchor";
import Styles from "./styles";

export default ({ pages, dark }) => {
  const classes = Styles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
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
      </Menu>
    </div>
  );
};

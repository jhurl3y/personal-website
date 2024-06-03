import { useState } from "react";
import IconButton from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import SmoothAnchor from "../smoothAnchor";

export default ({ pages, dark }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(eventTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      sx={(theme) => ({
        display: "none",
        marginLeft: "auto",
        [theme.breakpoints.down("xs")]: {
          display: "block",
        },
      })}
    >
      <IconButton
        aria-label="more"
        aria-controls="hamburger-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MenuIcon sx={{ color: !dark ? "text.primary" : "text.secondary" }} />
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
            sx={{ color: "text.primary", textDecoration: "none" }}
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

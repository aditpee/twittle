import * as React from "react";
import { Button } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import "./post-menu.scss";
import PropTypes from "prop-types";
import { Fragment } from "react";
import { Delete, PinOutline } from "../../utils/icons/icons";
import AlertDialog from "../alert-dialog/AlertDialog";

const PostMenu = ({ button, handleDeletePost, setOpenDialog, openDialog }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const dialogParams = {
    title: "Delete Post?",
    content:
      "This can’t be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results.",
    colorButton: "bg-accent-red",
    textButton: "Delete",
  };

  return (
    <Fragment>
      <Button
        className="button-mui-hover button-round clr-primary-000"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        color="inherit"
      >
        {button}
      </Button>
      <Menu
        id="basic-menu"
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          className="error"
          onClick={() => {
            handleClose();
            setOpenDialog(true);
          }}
        >
          <Delete className="clr-accent-red" />
          Delete
        </MenuItem>
        <MenuItem className="fw-bold" onClick={handleClose}>
          <PinOutline /> Pin to your account
        </MenuItem>
        <MenuItem className="fw-bold" onClick={handleClose}>
          Logout
        </MenuItem>
      </Menu>
      <AlertDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        dialogAction={handleDeletePost}
        dialogParams={dialogParams}
      />
    </Fragment>
  );
};

PostMenu.propTypes = {
  button: PropTypes.element,
  handleDeletePost: PropTypes.func,
  setOpenDialog: PropTypes.func,
  openDialog: PropTypes.bool,
};

export default PostMenu;

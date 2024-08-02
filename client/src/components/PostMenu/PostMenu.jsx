import * as React from "react";
import { Button, useMediaQuery } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import "./post-menu.scss";
import PropTypes from "prop-types";
import { Fragment } from "react";
import {
  Delete,
  FlagOutline,
  PeopleAdd,
  PinOutline,
  StopOutline,
} from "../../utils/icons/icons";
import AlertDialog from "../alert-dialog/AlertDialog";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const PostMenu = ({
  button,
  handleDeletePost,
  setOpenDialog,
  openDialog,
  isHaveMobileStyle,
  postUser,
  currentUser,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const isPhoneScreen = useMediaQuery("(max-width: 500px)");
  const [isFollowed, setIsFollowed] = useState(
    postUser?.followers.includes(currentUser?._id)
  );
  const { token } = useContext(AuthContext);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleFollow = async () => {
    handleClose();
    try {
      await axios.put(
        API_URL + `/api/users/${postUser?.username}/follow`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setIsFollowed((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
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
      {postUser?._id === currentUser?._id ? (
        <Menu
          className={isHaveMobileStyle ? "mobile-device" : ""}
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
          <MenuItem className="fw-bold clr-neutral-800" onClick={handleClose}>
            <PinOutline /> Pin to your profile
          </MenuItem>
          {isPhoneScreen && (
            <div className="postmenu-cancel ">
              <Button
                onClick={handleClose}
                className="fs-400 clr-neutral-800 fw-bold"
              >
                Cancel
              </Button>
            </div>
          )}
        </Menu>
      ) : (
        <Menu
          className={isHaveMobileStyle ? "mobile-device" : ""}
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
          <MenuItem className="fw-bold clr-neutral-800" onClick={handleFollow}>
            {isFollowed ? (
              <>
                <PeopleAdd /> {`Unfollow @${postUser?.username}`}
              </>
            ) : (
              <>
                <PeopleAdd /> {`Follow @${postUser?.username}`}
              </>
            )}
          </MenuItem>
          <MenuItem className="fw-bold clr-neutral-800" onClick={handleClose}>
            <StopOutline /> {`Block @${postUser?.username}`}
          </MenuItem>
          <MenuItem className="fw-bold clr-neutral-800" onClick={handleClose}>
            <FlagOutline /> Report post
          </MenuItem>
          {isPhoneScreen && (
            <div className="postmenu-cancel ">
              <Button
                onClick={handleClose}
                className="fs-400 clr-neutral-800  fw-bold"
              >
                Cancel
              </Button>
            </div>
          )}
        </Menu>
      )}
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
  isHaveMobileStyle: PropTypes.bool,
  postUser: PropTypes.object,
  currentUser: PropTypes.object,
};

export default PostMenu;

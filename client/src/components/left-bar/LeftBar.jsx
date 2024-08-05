import { MoreHoriz } from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PF } from "../../config";
import {
  Bookmark,
  BookmarkOutline,
  DisplayOutline,
  ExploreOutline,
  Home,
  HomeOutline,
  Message,
  MessageOutline,
  MoreRoundOutline,
  Profile,
  ProfileOutline,
  Search,
  SearchOutline,
  Tweet,
} from "../../utils/icons/icons";
import ThemeDialog from "../theme-dialog/ThemeDialog";
import "./left-bar.scss";

const LeftBar = ({ user, setShowModal }) => {
  const isLargeDesktopScreen = useMediaQuery("(min-width: 1280px)");
  const [openDialog, setOpenDialog] = useState(false);
  const page = useLocation().pathname?.split("/")[1];
  const getPage = () => {
    switch (page) {
      case "home":
      case "bookmarks":
      case "message":
      case "explore":
        return page;
      case user.username:
        return user.username;
      default:
        return "";
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
    <section className="left-bar">
      <div className="left-bar-container">
        <div>
          <div className="left-bar-logo">
            <img
              className={`${isLargeDesktopScreen ? "" : "hidden"}`}
              src={PF + "/images/logo.svg"}
              alt=""
            />
          </div>
          <div>
            <Link to={"/home"}>
              <div
                className={`left-bar-content fs-500 ${
                  isLargeDesktopScreen ? "" : "hidden"
                }`}
              >
                <div className="left-bar-icon clr-neutral-800 d-flex">
                  {getPage() === "home" ? <Home /> : <HomeOutline />}
                </div>
                <h4
                  className={`clr-neutral-800 fw-default ${
                    getPage() === "home" ? "fw-bold" : ""
                  }`}
                >
                  Home
                </h4>
              </div>
            </Link>
          </div>
          <div>
            <Link to={`/${user.username}`}>
              <div
                className={`left-bar-content fs-500 ${
                  isLargeDesktopScreen ? "" : "hidden"
                }`}
              >
                <div className="left-bar-icon clr-neutral-800 d-flex">
                  {getPage() === user.username ? (
                    <Profile />
                  ) : (
                    <ProfileOutline />
                  )}
                </div>
                <h4
                  className={`clr-neutral-800 fw-default ${
                    getPage() === user.username ? "fw-bold" : ""
                  }`}
                >
                  Profile
                </h4>
              </div>
            </Link>
          </div>
          <div>
            <Link to={"/explore"}>
              <div
                className={`left-bar-content fs-500 ${
                  isLargeDesktopScreen ? "" : "hidden"
                }`}
              >
                <div className="left-bar-icon clr-neutral-800 d-flex">
                  {getPage() === "explore" ? <Search /> : <SearchOutline />}
                </div>
                <h4
                  className={`clr-neutral-800 fw-default ${
                    getPage() === "explore" ? "fw-bold" : ""
                  }`}
                >
                  Explore
                </h4>
              </div>
            </Link>
          </div>
          <div>
            <Link to={"/message"}>
              <div
                className={`left-bar-content fs-500 ${
                  isLargeDesktopScreen ? "" : "hidden"
                }`}
              >
                <div className="left-bar-icon clr-neutral-800 d-flex">
                  {getPage() === "message" ? <Message /> : <MessageOutline />}
                </div>
                <h4
                  className={`clr-neutral-800 fw-default ${
                    getPage() === "message" ? "fw-bold" : ""
                  }`}
                >
                  Message
                </h4>
              </div>
            </Link>
          </div>
          <div>
            <Link to={"/bookmarks"}>
              <div
                className={`left-bar-content fs-500 ${
                  isLargeDesktopScreen ? "" : "hidden"
                }`}
              >
                <div className="left-bar-icon clr-neutral-800 d-flex">
                  {getPage() === "bookmarks" ? (
                    <Bookmark />
                  ) : (
                    <BookmarkOutline />
                  )}
                </div>
                <h4
                  className={`clr-neutral-800 fw-default ${
                    getPage() === "bookmarks" ? "fw-bold" : ""
                  }`}
                >
                  Bookmarks
                </h4>
              </div>
            </Link>
          </div>
          <div onClick={() => setOpenDialog(true)}>
            <div
              className={`left-bar-content fs-500 ${
                isLargeDesktopScreen ? "" : "hidden"
              }`}
            >
              <div className="left-bar-icon clr-neutral-800 d-flex">
                {getPage() === "home" ? "" : ""}
                <MoreRoundOutline />
              </div>
              <h4
                className={`clr-neutral-800 fw-default ${
                  getPage() === "home" ? "fw-bold" : ""
                }`}
              >
                Display
              </h4>
            </div>
          </div>
          <div>
            {isLargeDesktopScreen ? (
              <div
                onClick={() => setShowModal(true)}
                className="left-bar-content post-button margin-block-start-2 fs-500 fw-bold bg-primary-000 clr-neutral-000 radius-2"
              >
                Post
              </div>
            ) : (
              <div
                onClick={() => setShowModal(true)}
                className="left-bar-content left-bar-post margin-block-start-2 bg-primary-000 clr-neutral-000 radius-circle padding-2"
              >
                <Tweet />
              </div>
            )}
          </div>
        </div>
        <div className="left-bar-bottom">
          <div>
            {isLargeDesktopScreen ? (
              <>
                <div className="left-bar-profile">
                  <div className="left-bar-avatar">
                    <img
                      src={
                        user?.avatar
                          ? user?.avatar
                          : PF + "/images/no-avatar.svg"
                      }
                      alt=""
                    />
                  </div>
                  <div>
                    <p className="fs-400 clr-neutral-800 fw-bold">
                      {user.name}
                    </p>
                    <p className="fs-300 clr-neutral-600">{user.username}</p>
                  </div>
                </div>
                <div className="clr-neutral-600">
                  <MoreHoriz />
                </div>
              </>
            ) : (
              <div className="left-bar-profile">
                <div className="left-bar-avatar">
                  <img
                    src={
                      user?.avatar ? user?.avatar : PF + "/images/no-avatar.svg"
                    }
                    alt=""
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ThemeDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        dialogParams={dialogParams}
      />
    </section>
  );
};

LeftBar.propTypes = {
  user: PropTypes.object,
  setShowModal: PropTypes.func,
};

export default LeftBar;

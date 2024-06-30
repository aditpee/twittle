import { MoreHoriz } from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { PF } from "../../config";
import {
  BookmarkOutline,
  DisplayOutline,
  ExploreOutline,
  HomeOutline,
  MessageOutline,
  MoreRoundOutline,
  ProfileOutline,
  Search,
  SearchOutline,
  Tweet,
} from "../../utils/icons/icons";
import "./left-bar.scss";

const LeftBar = ({ user }) => {
  const isLargeDesktopScreen = useMediaQuery("(min-width: 1280px)");

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
                <div className="left-bar-icon d-flex">
                  <HomeOutline />
                </div>
                <h4>Home</h4>
              </div>
            </Link>
          </div>
          <div>
            <Link to={`/${user.username}`} reloadDocument>
              <div
                className={`left-bar-content fs-500 ${
                  isLargeDesktopScreen ? "" : "hidden"
                }`}
              >
                <div className="left-bar-icon d-flex">
                  <ProfileOutline />
                </div>
                <h4>Profile</h4>
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
                <div className="left-bar-icon d-flex">
                  <SearchOutline />
                </div>
                <h4>Explore</h4>
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
                <div className="left-bar-icon d-flex">
                  <MessageOutline />
                </div>
                <h4>Message</h4>
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
                <div className="left-bar-icon d-flex">
                  <BookmarkOutline />
                </div>
                <h4>Bookmarks</h4>
              </div>
            </Link>
          </div>
          <div>
            <div
              className={`left-bar-content fs-500 ${
                isLargeDesktopScreen ? "" : "hidden"
              }`}
            >
              <div className="left-bar-icon d-flex">
                <MoreRoundOutline />
              </div>
              <h4>Display</h4>
            </div>
          </div>
          <div>
            {isLargeDesktopScreen ? (
              <div className="left-bar-content post-button margin-block-start-2 fs-500 fw-bold bg-primary-000 clr-neutral-000 radius-2">
                Post
              </div>
            ) : (
              <div className="left-bar-content left-bar-post margin-block-start-2 bg-primary-000 clr-neutral-000 radius-circle padding-2">
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
                    <img src={PF + "/images/no-avatar.svg"} alt="" />
                  </div>
                  <div>
                    <p className="fs-400 fw-bold">{user.name}</p>
                    <p className="fs-300 clr-neutral-600">{user.username}</p>
                  </div>
                </div>
                <div>
                  <MoreHoriz />
                </div>
              </>
            ) : (
              <div className="left-bar-profile">
                <div className="left-bar-avatar">
                  <img src={PF + "/images/no-avatar.svg"} alt="" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

LeftBar.propTypes = {
  user: PropTypes.object,
};

export default LeftBar;

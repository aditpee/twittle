import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { PF } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import {
  ProfileOutline,
  BookmarkOutline,
  DisplayOutline,
  Exit,
} from "../../utils/icons/icons";
import AlertDialog from "../alert-dialog/AlertDialog";
import ThemeDialog from "../theme-dialog/ThemeDialog";
import "./mobile-menu.scss";

const MobileMenu = ({ isMenuHidden, setIsMenuHidden, user }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogLogout, setOpenDialogLogout] = useState(false);

  const { dispatch } = useContext(AuthContext);

  const dialogParams = {
    title: "Delete Post?",
    content:
      "This can’t be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results.",
    colorButton: "bg-accent-red",
    textButton: "Delete",
  };
  const dialogParamsLogout = {
    title: "Log out of Twittle?",
    content:
      "You can always log back in at any time. If you just want to switch accounts, you can do that by adding an existing account.",
    colorButton: "bg-neutral-800",
    textButton: "Log out",
  };

  return (
    <div className={isMenuHidden ? "mobile-menu hidden" : "mobile-menu"}>
      <div
        className="mobile-menu-outside"
        onClick={() => setIsMenuHidden(true)}
      ></div>
      <div className="mobile-menu-container bg-neutral-000">
        <div>
          <div className="mobile-menu-avatar">
            <img
              src={user?.avatar ? user?.avatar : PF + "/images/no-avatar.svg"}
              alt=""
            />
          </div>
          <div className="mobile-menu-name">
            <p
              style={{ fontSize: "17px" }}
              className="fs-500 clr-neutral-800 fw-bold"
            >
              {user.name}
            </p>
            <p className="clr-neutral-600">@{user.username}</p>
          </div>
          <div className="mobile-menu-info fs-300">
            <p className="clr-neutral-600">
              <span className="clr-neutral-800 fw-bold margin-inline-end-1">
                {user.followings.length}
              </span>
              Following
            </p>
            <p className="clr-neutral-600">
              <span className="clr-neutral-800 fw-bold margin-inline-end-1">
                {user.followers.length}
              </span>
              Followers
            </p>
          </div>
        </div>
        <div>
          <Link to={`/${user.username}`}>
            <div className="fs-600 clr-neutral-800">
              <ProfileOutline />
              <h4>Profile</h4>
            </div>
          </Link>
        </div>
        <div>
          <Link to={"/bookmarks"}>
            <div className="fs-600 clr-neutral-800">
              <BookmarkOutline />
              <h4>Bookmarks</h4>
            </div>
          </Link>
        </div>
        <div onClick={() => setOpenDialog(true)}>
          <Link>
            <div className="fs-600 clr-neutral-800">
              <DisplayOutline />
              <h4>Display</h4>
            </div>
          </Link>
        </div>
        <div onClick={() => setOpenDialogLogout(true)}>
          <Link>
            <div className="fs-600 clr-neutral-800">
              <Exit />
              <h4>Log out</h4>
            </div>
          </Link>
        </div>
      </div>
      <ThemeDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        dialogParams={dialogParams}
      />
      <AlertDialog
        openDialog={openDialogLogout}
        setOpenDialog={setOpenDialogLogout}
        dialogParams={dialogParamsLogout}
        dialogAction={() => {
          localStorage.setItem("token", "");
          dispatch({ type: "LOGOUT" });
        }}
      />
    </div>
  );
};

MobileMenu.propTypes = {
  isMenuHidden: PropTypes.bool,
  setIsMenuHidden: PropTypes.func,
  user: PropTypes.object,
};

export default MobileMenu;

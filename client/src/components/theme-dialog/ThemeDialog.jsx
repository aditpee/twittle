import "./theme-dialog.scss";
import PropTypes from "prop-types";
import { Fragment, useContext } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Post from "../post/Post";
import { CheckList } from "../../utils/icons/icons";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const ThemeDialog = ({
  openDialog,
  setOpenDialog,
  dialogAction,
  dialogParams: { title, content, colorButton, textButton },
}) => {
  const dialogRef = useRef();
  const bulletsTrackRef = useRef();
  const [accentPrimary, setAccentPrimary] = useState("");
  const handleClose = () => {
    setOpenDialog(false);
  };

  const { color, font, bg, dispatch } = useContext(ThemeContext);

  const postTheme = {
    createdAt: "2024-06-28T07:54:21.861Z",
    image: "",
    text: "At the heart of X are short messages called posts — just like this one — which can include photos, videos, links, text, hashtags, and mentions like @X .",
    updatedAt: "2024-06-28T07:54:21.861Z",
    userId: "666b7c63c8af266e418767b9",
    // _id: "667e6c2dcce20bf1a86a6192",
    _id: "posttheme",
  };

  const changeThemeBG = (theme) => {
    dispatch({
      type: "CHANGE_BG",
      theme,
    });
    localStorage.setItem("themebg", theme);
  };

  const changeThemeColor = (theme) => {
    dispatch({
      type: "CHANGE_COLOR",
      theme,
    });
    localStorage.setItem("themecolor", theme);
  };

  const hslPrimary = getComputedStyle(document.body).getPropertyValue(
    "--primary-000"
  );
  useEffect(() => {
    const [hue, sat] = hslPrimary.match(/\d+\.?\d*/g).map(Number);
    setAccentPrimary(`hsl(${hue}, ${sat}%, 75%)`);
  }, [hslPrimary]);

  return (
    <Fragment>
      <Dialog
        scroll="paper"
        ref={dialogRef}
        className="theme-dialog"
        maxWidth={"sm"}
        style={{ zIndex: "999999" }}
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="theme-dialog"
        aria-describedby="theme-dialog-description"
        dividers={"true"}
      >
        <DialogContent>
          <div id="theme-dialog-title">
            <h2 className="clr-neutral-800">Display</h2>
          </div>
          <p className="theme-dialog-subtitle clr-neutral-600">
            Manage your font size, color, and background. These settings affect
            all the X accounts on this browser.
          </p>
          <Post post={postTheme} type="theme" />
          <div className="font-theme padding-block-3">
            <h3 className="fs-500 fw-bold clr-neutral-800 padding-block-3">
              Font size
            </h3>
            <div className="font-theme-content">
              <span
                className="d-flex align-center clr-neutral-800"
                style={{ fontSize: "13px", flexGrow: "13px" }}
              >
                Aa
              </span>
              <div className="bullets-container">
                <div
                  ref={bulletsTrackRef}
                  style={{ backgroundColor: accentPrimary }}
                  className="bullets-track"
                >
                  <div
                    style={{ flexGrow: "0.5" }}
                    className="bullets-fill"
                  ></div>
                </div>
                <div className="bullets">
                  <div className="" style={{ left: "calc(0%)" }}></div>
                  <div className="" style={{ left: "calc(25%)" }}></div>
                  <div className="active" style={{ left: "calc(50%)" }}></div>
                  <div className="" style={{ left: "calc(75%)" }}></div>
                  <div className="" style={{ right: "calc(0%)" }}></div>
                </div>
              </div>
              <span
                className="d-flex align-center clr-neutral-800"
                style={{ fontSize: "20px", flexGrow: "20px" }}
              >
                Aa
              </span>
            </div>
          </div>
          <div className="color-theme padding-block-3">
            <h3 className="fs-500 fw-bold clr-neutral-800 padding-block-3">
              Color
            </h3>
            <div className="color-theme-buttons padding-block-3">
              <div className={color === "" ? "active" : ""}>
                <button
                  onClick={() => changeThemeColor("")}
                  className="bg-accent-blue"
                >
                  <CheckList />
                </button>
              </div>
              <div className={color === "yellow" ? "active" : ""}>
                <button
                  onClick={() => changeThemeColor("yellow")}
                  className="bg-accent-yellow"
                >
                  <CheckList />
                </button>
              </div>
              <div className={color === "pink" ? "active" : ""}>
                <button
                  onClick={() => changeThemeColor("pink")}
                  className="bg-accent-pink"
                >
                  <CheckList />
                </button>
              </div>
              <div className={color === "purple" ? "active" : ""}>
                <button
                  onClick={() => changeThemeColor("purple")}
                  className="bg-accent-purple"
                >
                  <CheckList />
                </button>
              </div>
              <div className={color === "orange" ? "active" : ""}>
                <button
                  onClick={() => changeThemeColor("orange")}
                  className="bg-accent-orange"
                >
                  <CheckList />
                </button>
              </div>
              <div className={color === "teal" ? "active" : ""}>
                <button
                  onClick={() => changeThemeColor("teal")}
                  className="bg-accent-teal"
                >
                  <CheckList />
                </button>
              </div>
            </div>
          </div>
          <div className="bg-theme padding-block-3">
            <h3 className="fs-500 fw-bold clr-neutral-800 padding-block-3">
              Background
            </h3>
            <div className="bg-theme-buttons padding-block-3">
              <button
                onClick={() => changeThemeBG("default")}
                className={`bg-accent-white clr-neutral-800 ${
                  bg === "default" ? "active" : ""
                }`}
              >
                <div className="bg-theme-radio">
                  <CheckList />
                </div>
                <p className="fw-bold">Default</p>
              </button>
              <button
                onClick={() => changeThemeBG("dim")}
                className={`bg-accent-dim clr-neutral-200 ${
                  bg === "dim" ? "active" : ""
                }`}
              >
                <div className="bg-theme-radio">
                  <CheckList />
                </div>
                <p className="fw-bold">Dim</p>
              </button>
              <button
                onClick={() => changeThemeBG("black")}
                className={`bg-accent-black clr-neutral-200 ${
                  bg === "black" ? "active" : ""
                }`}
              >
                <div className="bg-theme-radio">
                  <CheckList />
                </div>
                <p className="fw-bold">Light Off</p>
              </button>
            </div>
          </div>
        </DialogContent>
        <div className="candel-dialog">
          <Button
            className="cancel-dialog-button"
            onClick={handleClose}
            autoFocus
          >
            <span className="fw-bold fs-300">Done</span>
          </Button>
        </div>
      </Dialog>
    </Fragment>
  );
};

ThemeDialog.propTypes = {
  openDialog: PropTypes.bool,
  setOpenDialog: PropTypes.func,
  dialogAction: PropTypes.func,
  dialogParams: PropTypes.object,
};

export default ThemeDialog;

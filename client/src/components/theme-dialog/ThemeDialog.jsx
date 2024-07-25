import "./theme-dialog.scss";
import PropTypes from "prop-types";
import { Fragment } from "react";
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

const ThemeDialog = ({
  openDialog,
  setOpenDialog,
  dialogAction,
  dialogParams: { title, content, colorButton, textButton },
}) => {
  const handleClose = () => {
    setOpenDialog(false);
  };

  const postTheme = {
    bookmarks: [],
    comments: [],
    createdAt: "2024-06-28T07:54:21.861Z",
    image: "",
    likes: [],
    retweets: [],
    text: "At the heart of X are short messages called posts — just like this one — which can include photos, videos, links, text, hashtags, and mentions like @X .",
    updatedAt: "2024-06-28T07:54:21.861Z",
    userId: "666b7c63c8af266e418767b9",
    __v: 0,
    _id: "667e6c2dcce20bf1a86a6192",
  };

  return (
    <Fragment>
      <Dialog
        className="theme-dialog"
        maxWidth={"sm"}
        style={{ zIndex: "999999" }}
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="theme-dialog-title"
        aria-describedby="theme-dialog-description"
      >
        <DialogTitle id="theme-dialog-title">Display</DialogTitle>
        <p className="theme-dialog-subtitle">
          Manage your font size, color, and background. These settings affect
          all the X accounts on this browser.
        </p>
        <Post post={postTheme} type="theme" />
        <div className="font-theme padding-block-3">
          <h3 className="fs-500 fw-bold clr-neutral-800 padding-block-3">
            Font size
          </h3>
          <div className="bullets-container">
            <div style={{ flexGrow: "0.5" }} className="bullets-track"></div>
            <div className="bullets">
              <div className="" style={{ left: "calc(0%)" }}></div>
              <div className="" style={{ left: "calc(25%)" }}></div>
              <div className="active" style={{ left: "calc(50%)" }}></div>
              <div className="" style={{ left: "calc(75%)" }}></div>
              <div className="" style={{ left: "calc(100%)" }}></div>
            </div>
          </div>
        </div>
        <div className="color-theme padding-block-3">
          <h3 className="fs-500 fw-bold clr-neutral-800 padding-block-3">
            Color
          </h3>
          <div className="color-theme-buttons padding-block-3">
            <div>
              <button className="bg-accent-blue">
                <CheckList />
              </button>
            </div>
            <div>
              <button className="bg-accent-yellow">
                <CheckList />
              </button>
            </div>
            <div>
              <button className="bg-accent-pink">
                <CheckList />
              </button>
            </div>
            <div>
              <button className="bg-accent-purple">
                <CheckList />
              </button>
            </div>
            <div>
              <button className="bg-accent-orange">
                <CheckList />
              </button>
            </div>
            <div>
              <button className="bg-accent-teal">
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
            <button className="bg-accent-white clr-neutral-800 active">
              <div className="bg-theme-radio">
                <CheckList />
              </div>
              <p className="fw-bold">Default</p>
            </button>
            <button className="bg-accent-dim clr-neutral-200">
              <div className="bg-theme-radio">
                <CheckList />
              </div>
              <p className="fw-bold">Dim</p>
            </button>
            <button className="bg-accent-black clr-neutral-200">
              <div className="bg-theme-radio">
                <CheckList />
              </div>
              <p className="fw-bold">Light Off</p>
            </button>
          </div>
        </div>
        <DialogActions>
          <Button
            className="cancel-dialog-button"
            onClick={handleClose}
            autoFocus
          >
            Done
          </Button>
        </DialogActions>
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

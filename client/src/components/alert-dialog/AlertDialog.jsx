import "./alert-dialog.scss";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Fragment } from "react";
import PropTypes from "prop-types";

const AlertDialog = ({
  openDialog,
  setOpenDialog,
  dialogAction,
  dialogParams: { title, content, colorButton, textButton },
}) => {
  const handleClose = () => {
    setOpenDialog(false);
  };

  return (
    <Fragment>
      <Dialog
        maxWidth={"xs"}
        style={{ zIndex: "999999" }}
        open={openDialog}
        onClose={handleClose}
        className={"alert-dialog"}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <h3 className="clr-neutral-800">{title}</h3>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p className="clr-neutral-600">{content}</p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            className={`primary-dialog-button ${colorButton}`}
            onClick={() => {
              handleClose();
              dialogAction();
            }}
          >
            {textButton}
          </Button>
          <Button
            className="cancel-dialog-button"
            onClick={handleClose}
            autoFocus
          >
            <span className="clr-neutral-800">Cancel</span>
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

AlertDialog.propTypes = {
  openDialog: PropTypes.bool,
  setOpenDialog: PropTypes.func,
  dialogAction: PropTypes.func,
  dialogParams: PropTypes.object,
};

export default AlertDialog;

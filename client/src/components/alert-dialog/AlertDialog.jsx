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
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
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
            Cancel
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

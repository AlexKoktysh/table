import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Tooltip } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import * as React from "react";
import Draggable from "react-draggable";
import { TextareaComponent } from "./TextareaComponent";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function PaperComponent(props) {
  return (
    <Draggable
      handle='#draggable-dialog-title'
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function UserDialogComponent({
  openDialogText,
  agreeActionText,
  agreeActionFunc,
  id,
  field,
  defaultValue = "",
  desAgreeActionText = "",
}) {
  const [description, setDescription] = useState(openDialogText || "Здесь можно ввести описание");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const AgreeCallback = () => {
    setDescription(value);
    agreeActionFunc(id, value, field);
    handleClose();
  };
  const DesAgreeCallback = () => {
    setValue(defaultValue);
    setOpen(false);
  };

  return (
    <>
        <Tooltip title={description}>
            <span onClick={handleClickOpen}>{description}</span>
        </Tooltip>
        <BootstrapDialog
            onClose={handleClose}
            PaperComponent={PaperComponent}
            aria-labelledby='draggable-dialog-title'
            open={open}
        >
            <BootstrapDialogTitle
                style={{ cursor: "move" }}
                id='draggable-dialog-title'
                onClose={handleClose}
            >
                Введите описание
            </BootstrapDialogTitle>
            <DialogContent dividers>
                <TextareaComponent value={value} setValue={setValue} />
            </DialogContent>
            <DialogActions>
            <Button
                autoFocus
                onClick={AgreeCallback}
                children={agreeActionText}
            />
            <Button
                autoFocus
                onClick={DesAgreeCallback}
                className={desAgreeActionText === "" ? "d-none" : "button"}
                children={desAgreeActionText}
            />
            </DialogActions>
        </BootstrapDialog>
    </>
  );
}
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Chip from "@material-ui/core/Chip";

import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";

import createNewSubGroupIcon from "../assets/icons/subgroup create.svg"
import createNewGroupIcon from "../assets/icons/group create.svg"
import renameSubGroupIcon from "../assets/icons/subgroup edit.svg"
import renameGroupIcon from "../assets/icons/group edit.svg"

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export default function TableContextMenu(props) {
  const handleClose = () => {
    props.setContextMenuAnchor(null);
  };

  const onClickAddAbove = (e) => {
    props.addRow(
      props.contextMenuAnchor.taskId,
      false,
      props.contextMenuAnchor.copyTaskGroup,
      props.contextMenuAnchor.copyTaskSubGroup
    );
    handleClose();
  };

  const onClickAddBelow = (e) => {
    props.addRow(
      props.contextMenuAnchor.taskId,
      true,
      props.contextMenuAnchor.copyTaskGroup,
      props.contextMenuAnchor.copyTaskSubGroup
    );
    handleClose();
  };

  const onClickRemove = (e) => {
    props.removeRow(props.contextMenuAnchor.taskId);
    handleClose();
  };

  const onClickOnHoldAction = (e) => {
    props.onHoldAction(
      props.contextMenuAnchor.taskId,
      props.contextMenuAnchor.isOnHold
    );
    handleClose();
  };

  const handleOnCreateNewGroupAction = () => {
    props.handleOnCreateNewGroupAction(props.contextMenuAnchor.taskId)
    handleClose();
  };

  const handleOnCreateNewSubGroupAction = () => {
    props.handleOnCreateNewSubGroupAction(props.contextMenuAnchor.taskId)
    handleClose();
  };

  const handleOnRenameGroupAction = () => {
    props.handleOnRenameGroupAction(props.contextMenuAnchor.taskId)
    handleClose();
  };

  const handleOnRenameSubGroupAction = () => {
    props.handleOnRenameSubGroupAction(props.contextMenuAnchor.taskId)
    handleClose();
  };

  return (
    <StyledMenu
      id="customized-menu"
      anchorReference="anchorPosition"
      anchorPosition={{
        left: props.contextMenuAnchor.xPos,
        top: props.contextMenuAnchor.yPos,
      }}
      keepMounted
      open={Boolean(props.contextMenuAnchor)}
      onClose={handleClose}
      autoFocus={false}
    >
      {props.adminMode&&<StyledMenuItem onClick={onClickAddAbove}>
        <ListItemIcon>
          <KeyboardArrowUpIcon fontSize="medium" />
          {props.contextMenuAnchor.copyTaskGroup && !props.contextMenuAnchor.copyTaskSubGroup && (
            <Chip size="small" label="tg" clickable={false} />
          )}
          {props.contextMenuAnchor.copyTaskSubGroup && (
            <Chip size="small" label="tsg" clickable={false} />
          )}
        </ListItemIcon>
        <ListItemText primary="Add a row above" />
      </StyledMenuItem>}
      {props.adminMode&&<StyledMenuItem onClick={onClickAddBelow}>
        <ListItemIcon>
          <KeyboardArrowDownIcon fontSize="medium" />
        </ListItemIcon>
        <ListItemText primary="Add a row below" />
      </StyledMenuItem>}
      {props.adminMode&&<StyledMenuItem onClick={onClickRemove}>
        <ListItemIcon>
          <DeleteForeverIcon fontSize="medium" />
        </ListItemIcon>
        <ListItemText primary="Remove row" />
      </StyledMenuItem>}

      {props.contextMenuAnchor.isOnHold ? (
        <StyledMenuItem onClick={onClickOnHoldAction}>
          <ListItemIcon>
            <PlayCircleFilledIcon fontSize="medium" />
          </ListItemIcon>
          <ListItemText primary="Remove hold" />
        </StyledMenuItem>
      ) : (
        <StyledMenuItem onClick={onClickOnHoldAction}>
          <ListItemIcon>
            <PauseCircleFilledIcon fontSize="medium" />
          </ListItemIcon>
          <ListItemText primary="Put on hold" />
        </StyledMenuItem>
      )}


      {!props.readOnlyMode &&
        [<StyledMenuItem onClick={handleOnCreateNewGroupAction}>
          <ListItemIcon>
            <img src={createNewGroupIcon} alt="" />
          </ListItemIcon>
          <ListItemText primary="Сreate new group" />
        </StyledMenuItem>,

        props.contextMenuAnchor.hasTaskGroup && <StyledMenuItem onClick={handleOnCreateNewSubGroupAction}>
          <ListItemIcon>
            <img src={createNewSubGroupIcon} alt="" />
          </ListItemIcon>
          <ListItemText primary="Сreate new sub group" />
        </StyledMenuItem>,

        <StyledMenuItem onClick={handleOnRenameGroupAction}>
          <ListItemIcon>
            <img src={renameGroupIcon} alt="" />
          </ListItemIcon>
          <ListItemText primary="Rename group" />
        </StyledMenuItem>,

        props.contextMenuAnchor.hasTaskSubGroup && <StyledMenuItem onClick={handleOnRenameSubGroupAction}>
          <ListItemIcon>
            <img src={renameSubGroupIcon} alt="" />
          </ListItemIcon>
          <ListItemText primary="Rename sub group" />
        </StyledMenuItem>
        ]
        }
    </StyledMenu>
  );
}

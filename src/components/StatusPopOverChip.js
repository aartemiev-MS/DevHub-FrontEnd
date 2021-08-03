import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import FormGroup from "@material-ui/core/FormGroup";
import Tooltip from '@material-ui/core/Tooltip';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
}));

export default function StatusPopOverChip(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const statuses = props.statusSource;

  const handlePopOverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e) => {
    setAnchorEl(null);
  };

  const isOpen = Boolean(anchorEl);
  const currentStatus = statuses.find(s => s.id === props.statusId)

  return (
    <>
      <Tooltip title={currentStatus.statusName} arrow interactive>
        <img className="status-item-icon" alt="" src={currentStatus.icon} onClick={handlePopOverOpen} />
      </Tooltip>
      {!props.readOnlyMode && (
        <Popover
          open={isOpen}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <FormGroup column>
            {statuses.filter(s => s.id !== props.taskId).map((status) => (
              <MenuItem
                onClick={e => props.handleStatusSelected(status.id, props.taskId)}>
                <img className="status-item-icon" alt="" src={status.icon} />
                <span className="status-item-name">{status.statusName}</span>
              </MenuItem>
            ))}
          </FormGroup>
        </Popover>
      )}
    </>
  );
}

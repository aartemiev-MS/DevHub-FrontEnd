import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import FormGroup from "@material-ui/core/FormGroup";
import StatusChip from "./StatusChip";
import Chip from "@material-ui/core/Chip";

import { getTasksData } from "../tableData";

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

  console.log(props.statusId, statuses, statuses.find(s => {
    const debug = s.id === props.statusId;
    // debugger
    return s.id === props.statusId;
  }));

  return (
    <span>
      <Chip
        label={statuses.find(s => s.id === props.statusId) ? statuses.find(s => s.id === props.statusId).statusName : "not found"}
        // label={statuses[0].statusName}
        size="small"
        className="status-chip"
        onClick={handlePopOverOpen}
        //stat={props.stat}
      />
      {!props.readOnly && (
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
            horizontal: "center",
          }}
        >
          <FormGroup column className="status-popover">
            {statuses.filter(s => s.id !== props.taskId).map((status) => (
              <Chip
                size="small"
                stat={status}
                label={status.statusName}
                onClick={e =>
                  props.handleStatusSelected(status.id, props.taskId)
                }
                clickable
              />
            ))}
          </FormGroup>
        </Popover>
      )}
    </span>
  );
}

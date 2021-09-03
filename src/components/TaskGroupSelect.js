import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

export default function TaskGroupSelect(props) {
  const handleChange = (e) => {
    const newGroupId = e.target.value === 0 ? null : e.target.value;
    const addNewGroupRequest = e.target.value === -1;

    if (addNewGroupRequest) {
      props.handleOnCreateNewGroup(props.taskId);
    } else {
      props.handleOnChangeTaskGroup(props.taskId, newGroupId);
    }
  };

  return (
    <FormControl variant="outlined" className="task-group-select">
      <Select
        value={props.currentGroupId ?? 0}
        color="primary"
        onChange={handleChange}
      >
        <MenuItem key={0} value={0}>
          Not Selected
        </MenuItem>
        <MenuItem key={-1} value={-1}>
          Create a New One
        </MenuItem>
        {props.taskGroups
          .sort((tg1, tg2) => tg1.name.localeCompare(tg2.name))
          .map((group) => (
            <MenuItem key={group.id} value={group.id}>
              {group.name === "" ? "Blank name" : group.name}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}

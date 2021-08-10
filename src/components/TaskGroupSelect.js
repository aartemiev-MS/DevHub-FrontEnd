import React from 'react'
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

export default function TaskGroupSelect(props) {

    const handleChange = e => props.handleOnChangeTaskGroup(props.taskId, e.target.value === 0 ? null : e.target.value)

    return <FormControl variant="outlined" className='task-group-select'>
        <Select
            value={props.currentGroupId ?? 0}
            color='primary'
            onChange={handleChange}
        >
            <MenuItem
                key={0}
                value={0}>
                Not Selected
                </MenuItem>
            {props.taskGroups.map(group =>
                <MenuItem
                    key={group.id}
                    value={group.id}>
                    {group.name}
                </MenuItem>)}
        </Select>
    </FormControl>
}
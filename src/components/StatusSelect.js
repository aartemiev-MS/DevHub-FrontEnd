import React from 'react'
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { SubscriptionsOutlined } from '@material-ui/icons';

export default function StatusSelect(props) {

    const handleChange = e => props.handleOnChangeTaskStatus(props.taskId, e.target.value)

    return <FormControl variant="outlined">
        <Select
            value={props.currentStatusId}
            color='primary'
            onChange={handleChange}
        >
            {props.statuses.map(status => <MenuItem key={status.id} value={status.id}>{status.statusName}</MenuItem>)}
        </Select>
    </FormControl>
}
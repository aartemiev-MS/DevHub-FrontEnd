import React from 'react'
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { getStatuses } from '../tableData'

export default function StatusSelect(props) {

    const handleChange = e => props.handleOnChangeTaskStatus(props.taskId, e.target.value)

    return <FormControl variant="outlined">
        <Select
            value={props.currentStatus.id}
            color='primary'
            onChange={handleChange}
        >
            {getStatuses().map(status => <MenuItem key={status.id} value={status.id}>{status.name}</MenuItem>)}
        </Select>
    </FormControl>
}
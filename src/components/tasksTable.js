import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Tooltip from '@material-ui/core/Tooltip';

import tableData, { getStatuses } from '../tableData'

import Chip from '@material-ui/core/Chip';

import DateTimePicker from './DateTimePicker'

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

export default function TasksTable(props) {
    const classes = useStyles();

    const openTaskInfo = task => {
        props.setDetailedTaskInfo(task)
    }

    const statusSelect = (status) => {
        return <FormControl variant="outlined">
            <Select
                value={status.id}
                color='primary'
            //onChange={handleChange}
            >
                {getStatuses().map(status => <MenuItem key={status.id} value={status.id}>{status.name}</MenuItem>)}
            </Select>
        </FormControl>
    }

    const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);

    console.log(capitalizeFirstLetter('sasha'))
    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} size="small">
                <TableHead>
                    <TableRow>
                        <TableCell align='center' variant='head'>
                            Task Name</TableCell>
                        <TableCell align='center' >Devs</TableCell>
                        <TableCell align='center' >Status</TableCell>
                        <TableCell align='center' >Task Info</TableCell>
                        <TableCell align='center' >Tags</TableCell>
                        {props.showDatesInfo && Object.entries(tableData()[0].dates).map(entry => <TableCell align='center' >{capitalizeFirstLetter(entry[0])}</TableCell>)}
                        {props.showBranchesInfo && Object.entries(tableData()[0].microServicesBranchData).slice(1).map(entry => <TableCell align='center' >{entry[0]}</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableData().map((task) => (
                        <TableRow key={task.id}>
                            <TableCell align='center' >{task.taskName}</TableCell>
                            <TableCell align='center' >{task.devs.join(", ")}</TableCell>
                            <TableCell align='center' >{statusSelect(task.status)}</TableCell>
                            <TableCell align='center' >
                                <Tooltip title={task.taskInfo} arrow interactive>
                                    <IconButton onClick={() => { openTaskInfo(task) }}>
                                        <ImportContactsIcon fontSize="large" color='primary' />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                            <TableCell align='center' >{task.tags.map(tag => <Chip label={tag} />)}</TableCell>
                            {props.showDatesInfo && Object.entries(tableData()[0].dates).map(entry => <TableCell align='center' ><DateTimePicker dateName={capitalizeFirstLetter(entry[0])} date={entry[1]} /></TableCell>)}

                            {props.showBranchesInfo && Object.entries(task.microServicesBranchData).slice(1).map(entry => <TableCell align='center' >{entry[1]}</TableCell>)}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
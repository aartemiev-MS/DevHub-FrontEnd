import React, { useState } from 'react';

import { withStyles, makeStyles } from '@material-ui/core/styles';
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

function StatusSelectFiltering(props) {
    const [currentStatusId, setCurrentStatusId] = useState([0])

    const handleChange = e => setCurrentStatusId(e.target.value)

    return <FormControl variant="outlined">
        <Select
            multiple
            value={currentStatusId}
            color='primary'
            onChange={handleChange}
        >
            {getStatuses().map(status => <MenuItem key={status.id} value={status.id}>{status.name}</MenuItem>)}
        </Select>
    </FormControl>
}

function StatusSelectNormal(props) {
    const [currentStatusId, setCurrentStatusId] = useState(props.status.id)

    const handleChange = e => setCurrentStatusId(e.target.value)

    return <FormControl variant="outlined">
        <Select
            native
            value={currentStatusId}
            color='primary'
            onChange={handleChange}
        >
            {getStatuses().map(status => <option key={status.id} value={status.id}>{status.name}</option>)}
        </Select>
    </FormControl>
}

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

export default function TasksTable(props) {
    const classes = useStyles();

    const openTaskInfo = task => {
        props.setDetailedTaskInfo(task)
    }

    const datesInfoItems = (task) => {
        return (
            Object.entries(task.dates).map(entry =>
                <StyledTableCell align='center' >
                    <DateTimePicker dateName={capitalizeFirstLetter(entry[0])} date={entry[1]} />
                </StyledTableCell>)
        )
    }

    const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);

    return (
        <>
            <TableContainer component={Paper}>
                <Table className={classes.table} size="small">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align='center' variant='head'></StyledTableCell>
                            <StyledTableCell align='center' >Devs</StyledTableCell>
                            <StyledTableCell className='cell-status' align='center' ><StatusSelectFiltering /></StyledTableCell>
                            <StyledTableCell className='cell-task-info' align='center' ></StyledTableCell>
                            <StyledTableCell align='center' >Tags</StyledTableCell>
                            {props.showDatesInfo && Object.entries(tableData()[0].dates).map(entry => <StyledTableCell align='center' ></StyledTableCell>)}
                            {props.showBranchesInfo && Object.entries(tableData()[0].microServicesBranchData).slice(1).map(entry => <StyledTableCell align='center' className='branch-info-header-cell'></StyledTableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align='center' variant='head'>
                                Task Name</StyledTableCell>
                            <StyledTableCell align='center' >Devs</StyledTableCell>
                            <StyledTableCell className='cell-status' align='center' >Status</StyledTableCell>
                            <StyledTableCell className='cell-task-info' align='center' >Task Info</StyledTableCell>
                            <StyledTableCell align='center' >Tags</StyledTableCell>
                            {props.showDatesInfo && Object.entries(tableData()[0].dates).map(entry => <StyledTableCell align='center' >{capitalizeFirstLetter(entry[0])}</StyledTableCell>)}
                            {props.showBranchesInfo && Object.entries(tableData()[0].microServicesBranchData).slice(1).map(entry => <StyledTableCell align='center' className='branch-info-header-cell'>{entry[0]}</StyledTableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableData().map((task) => (
                            <StyledTableRow key={task.id}>
                                <StyledTableCell align='center' >{task.taskName}</StyledTableCell>
                                <StyledTableCell align='center' >{task.devs.join(", ")}</StyledTableCell>
                                <StyledTableCell className='cell-status' align='center' ><StatusSelectNormal status={task.status} /></StyledTableCell>
                                <StyledTableCell className='cell-task-info' align='center' >
                                    <Tooltip title={task.taskInfo} arrow interactive>
                                        <IconButton onClick={() => { openTaskInfo(task) }}>
                                            <ImportContactsIcon fontSize="large" color='primary' />
                                        </IconButton>
                                    </Tooltip>
                                </StyledTableCell>
                                <StyledTableCell align='center' >{task.tags.map(tag => <Chip label={tag} />)}</StyledTableCell>
                                {props.showDatesInfo && datesInfoItems(task)}

                                {props.showBranchesInfo && Object.entries(task.microServicesBranchData).slice(1).map(entry => <StyledTableCell align='center' className={'branch-info-cell ' + (entry[1] === 'demo' && 'default-branch-name')}>{entry[1]}</StyledTableCell>)}
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </>
    );
}
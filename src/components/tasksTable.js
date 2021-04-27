import React, { useEffect, useState } from 'react';

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
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';

import tableDataSource, { getStatuses, getEmptyTask, getDevs } from '../tableData'

import DateTimePicker from './DateTimePicker'

import TableContextMenu from './TableContextMenu'

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

function StatusSelectFiltering(props) {
    const [currentStatusId, setCurrentStatusId] = useState([0])

    const handleChange = e => setCurrentStatusId(e.target.value)
    return null

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
            value={currentStatusId}
            color='primary'
            onChange={handleChange}
        >
            {getStatuses().map(status => <MenuItem key={status.id} value={status.id}>{status.name}</MenuItem>)}
        </Select>
    </FormControl>
}

function MainDevSelectNormal(props) {
    const [currentDevId, setCurrentDevId] = useState(props.dev.id)

    const handleChange = e => setCurrentDevId(e.target.value)

    return <FormControl variant="outlined">
        <Select
            value={currentDevId}
            color='primary'
            onChange={handleChange}
            inputProps={{ readOnly: props.readOnly }}
        >
            {getDevs().map(dev => <MenuItem key={dev.id} value={dev.id}>{dev.name}</MenuItem>)}
        </Select>
    </FormControl>
}

function CollaboratorsSelectNormal(props) {
    const [collaboratorIds, setCollaboratorIds] = useState(props.devs.map(dev => dev.id))

    const handleChange = e => setCollaboratorIds(e.target.value)

    return <FormControl variant="outlined">
        <Select
            multiple
            value={collaboratorIds}
            color='primary'
            onChange={handleChange}
            inputProps={{ readOnly: props.readOnly }}
        >
            {getDevs().map(dev => <MenuItem key={dev.id} value={dev.id}>{dev.name}</MenuItem>)}
        </Select>
    </FormControl>
}

export default function TasksTable(props) {
    const [contextMenuAnchor, setContextMenuAnchor] = useState(null)
    const [tableData, setTableData] = useState(tableDataSource())

    useEffect(() => {
        document.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            // console.log('Boolean(contextMenuAnchor):', (contextMenuAnchor))
            // if ((contextMenuAnchor)) {
            //     setContextMenuAnchor(null)
            // }
        });
    }, [])

    useEffect(() => {
        console.log('use effect handling set worked')
        var rows = Array.from(document.getElementsByClassName('task-row'))

        rows && rows.forEach((row, i) => {
            row.addEventListener("contextmenu", (event) => {
                event.preventDefault();
                const xPos = event.pageX
                const yPos = event.pageY

                setContextMenuAnchor([xPos, yPos, i])
            });
        });
    }, [tableData])

    const classes = useStyles();

    const openTaskInfo = task => {
        props.setDetailedTaskInfo(task)
    }

    const datesInfoItems = (task, readOnlyMode) => {
        return Object.entries(task.dates).map(entry =>
            <TableCell align='center' >
                <DateTimePicker dateName={capitalizeFirstLetter(entry[0])} date={entry[1]} readOnly={readOnlyMode} />
            </TableCell>)
    }
    const branchesInfoItems = (task) =>
        Object.entries(task.microServicesBranchData).slice(1).map(entry =>
            <TableCell align='center' className={'branch-info-cell ' + (entry[1] === 'demo' && 'default-branch-name')}>{entry[1]}</TableCell>)

    const datesInfoHeaders = () => Object.entries(tableData[0].dates).map(entry => <TableCell align='center' >{capitalizeFirstLetter(entry[0])}</TableCell>)
    const branchesInfoHeaders = () => Object.entries(tableData[0].microServicesBranchData).slice(1).map(entry => <TableCell align='center' className='branch-info-header-cell'>{entry[0]}</TableCell>)

    const handleBranchesInfoChange = e => props.setShowBranchesInfo(!props.showBranchesInfo)
    const handleDatesInfoChange = e => props.setShowDatesInfo(!props.showDatesInfo)
    const handleReadOnlyModeChange = e => props.setReadOnlyMode(!props.readOnlyMode)

    const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);

    const addRow = atPotition => {
        let updatedTableData = Object.assign({}, tableData)

        updatedTableData = Object.values(updatedTableData)
        updatedTableData.splice(atPotition, 0, getEmptyTask())

        setTableData(updatedTableData)
    }

    const removeRow = atPotition => {
        let updatedTableData = tableData
        updatedTableData.splice(atPotition, 1)

        setTableData(updatedTableData)
    }


    return (
        <>

            <TableContainer component={Paper}>
                <Table className={classes.table} size="small">
                    <TableHead>
                        <TableRow className='filter-row'>
                            <TableCell align='center' className='cell-task-group'></TableCell>
                            <TableCell align='center' className='cell-task-sub-group'></TableCell>
                            <TableCell align='center' className='cell-task-name'></TableCell>
                            <TableCell align='center' className='cell-main-dev-name' ></TableCell>
                            <TableCell align='center' className='cell-coll-dev-name' ></TableCell>
                            <TableCell align='center' className='cell-status' ><StatusSelectFiltering /></TableCell>
                            <TableCell align='center' className='cell-task-info' >
                                <IconButton onClick={handleReadOnlyModeChange}>
                                    <EditIcon fontSize="medium" color={props.readOnlyMode ? 'disabled' : 'primary'} />
                                </IconButton>
                                <IconButton onClick={handleBranchesInfoChange}>
                                    <AccountTreeIcon fontSize="medium" color={props.showBranchesInfo ? 'primary' : 'disabled'} />
                                </IconButton>
                                <IconButton onClick={handleDatesInfoChange}>
                                    <EventAvailableIcon fontSize="medium" color={props.showDatesInfo ? 'primary' : 'disabled'} />
                                </IconButton>
                            </TableCell>
                            {props.showDatesInfo && Object.entries(tableData[0].dates).map(entry => <TableCell align='center' ></TableCell>)}
                            {props.showBranchesInfo && Object.entries(tableData[0].microServicesBranchData).slice(1).map(entry => <TableCell align='center' className='branch-info-header-cell'></TableCell>)}
                        </TableRow>
                        <TableRow className='black-row'>
                            <TableCell align='center' className='cell-task-group'>Task Group</TableCell>
                            <TableCell align='center' className='cell-task-sub-group'>Task Sub Group</TableCell>
                            <TableCell align='center' className='cell-task-name'>Task Name</TableCell>
                            <TableCell align='center' className='cell-main-dev-name' >Main Dev</TableCell>
                            <TableCell align='center' className='cell-coll-dev-name' >Collaborators</TableCell>
                            <TableCell align='center' className='cell-status' >Status</TableCell>
                            <TableCell align='center' className='cell-task-info' >Task Info</TableCell>
                            {props.showDatesInfo && datesInfoHeaders()}
                            {props.showBranchesInfo && branchesInfoHeaders()}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableData.map((task) => (
                            <TableRow className='task-row' key={task.id}>
                                <TableCell align='center' className='cell-task-group'>{task.taskGroup}</TableCell>
                                <TableCell align='center' className='cell-task-sub-group'>{task.taskSubGroup}</TableCell>
                                <TableCell align='center' className='cell-task-name' ><TextField id="standard-basic" defaultValue={task.taskName} InputProps={{ readOnly: props.readOnlyMode }} /></TableCell>
                                <TableCell align='center' className='cell-main-dev-name' ><MainDevSelectNormal dev={task.mainDev} readOnly={props.readOnlyMode} /></TableCell>
                                <TableCell align='center' className='cell-coll-dev-name' ><CollaboratorsSelectNormal devs={task.collaborators} readOnly={props.readOnlyMode} /></TableCell>
                                <TableCell align='center' className='cell-status' ><StatusSelectNormal status={task.status} /></TableCell>
                                <TableCell align='center' className='cell-task-info' >
                                    <Tooltip title={task.taskInfo} arrow interactive>
                                        <IconButton onClick={() => { openTaskInfo(task) }}>
                                            <ImportContactsIcon fontSize="large" color='primary' />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                                {props.showDatesInfo && datesInfoItems(task, props.readOnlyMode)}
                                {props.showBranchesInfo && branchesInfoItems(task)}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TableContextMenu addRow={addRow} removeRow={removeRow} contextMenuAnchor={contextMenuAnchor} setContextMenuAnchor={setContextMenuAnchor} />
        </>
    );
}
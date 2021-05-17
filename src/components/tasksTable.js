import React, { useEffect, useState, useCallback } from 'react';

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
import PetsIcon from '@material-ui/icons/Pets';

import tableDataSource, { getStatuses, getEmptyTask, getDevs } from '../tableData'

import DateTimePicker from './DateTimePicker'
import DevsFilteringPopOverButton from './DevsFilteringPopOverButton'
import TableContextMenu from './TableContextMenu'
import TaskInfoModal from './TaskInfoModal'

import { Scrollbars } from 'react-custom-scrollbars';


import { SortableContainer, SortableElement } from "react-sortable-hoc";
import arrayMove from "../components/draggableTable/arrayMove";
import { SortableHandle } from "react-sortable-hoc";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

function DevSelect(props) {
    const handleChange = e => props.setFilterDevIds(e.target.value)

    return <FormControl variant="outlined">
        <Select
            value={props.filterDevIds}
            color='primary'
            onChange={handleChange}
            multiple
            renderValue={() => getDevs().map(d => props.filterDevIds.includes(d.id) && d.name.charAt(0)).filter(d => d).join(',')}
        >
            {getDevs().map(dev => <MenuItem key={dev.id} value={dev.id}>{dev.name}</MenuItem>)}
        </Select>
    </FormControl>
}

function StatusSelect(props) {
    const [currentStatusId, setCurrentStatusId] = useState(!props.filteringMode && props.status.id)

    const handleChange = e => props.filteringMode ? props.setFilterStatusIds(e.target.value) : setCurrentStatusId(e.target.value)

    return <FormControl variant="outlined">
        <Select
            value={props.filteringMode ? props.filterStatusIds : currentStatusId}
            color='primary'
            onChange={handleChange}
            multiple={props.filteringMode}
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

    const [filterStatusIds, setFilterStatusIds] = useState(getStatuses().map(status => status.id))
    const [filterDevIds, setFilterDevIds] = useState(getDevs().map(d => d.id))
    const [taskInfoModal, setTaskInfoModal] = useState(null)

    useEffect(() => {
        document.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });
    }, [])

    useEffect(() => {
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

    useEffect(() => {
        let newTableData = tableDataSource()

        newTableData = newTableData.filter(item => filterStatusIds.includes(item.status.id))

        newTableData = newTableData.filter(item => filterDevIds.includes(item.mainDev.id))

        setTableData(newTableData)
    }, [filterStatusIds, filterDevIds])

    const classes = useStyles();

    const openTaskInfo = task => {
        setTaskInfoModal(task)
    }

    const isBranchesGroupEdgeItem = entry => {
        const microServiceName = entry[0]

        if (microServiceName === 'MAService' || microServiceName === 'Scheduling')
            return 'group-edge'
        else
            return ''
    }

    const datesInfoItems = (task, readOnlyMode) => {
        return Object.entries(task.dates).map(entry =>
            <TableCell className='cell-date-picker' align='center' >
                <DateTimePicker dateName={capitalizeFirstLetter(entry[0])} date={entry[1]} readOnly={readOnlyMode} />
            </TableCell>)
    }
    const branchesInfoItems = (task) =>
        Object.entries(task.microServicesBranchData).slice(1).map(entry =>
            <TableCell align='center' className={'branch-info-cell ' + (entry[1] === 'demo' ? 'default-branch-name ' : '') + isBranchesGroupEdgeItem(entry)}>{entry[1]}</TableCell>)

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

    const SortableCont = SortableContainer(({ children }) => {
        return <tbody>{children}</tbody>;
    });

    const onSortEnd = useCallback(({ oldIndex, newIndex }) => {
        setTableData(oldItems => arrayMove(oldItems, oldIndex, newIndex));
    }, []);

    const SortableTableRow = SortableElement(props => <SortableTableRowElement {...props} />);

    const RowHandler = SortableHandle(() => <PetsIcon style={{ cursor: 'grab' }} />);

    const SortableTableRowElement = (props) => {
        return (
            <TableRow className='task-row' key={props.task.id}>
                <TableCell align='center' className='cell-dragger'><RowHandler /></TableCell>
                <TableCell align='center' className='cell-task-group'>{props.task.taskGroup}</TableCell>
                <TableCell align='center' className='cell-task-sub-group'>{props.task.taskSubGroup}</TableCell>
                <TableCell align='center' className='cell-task-name' ><TextField id="standard-basic" defaultValue={props.task.taskName} InputProps={{ readOnly: props.readOnlyMode }} /></TableCell>
                <TableCell align='center' className='cell-main-dev-name' ><MainDevSelectNormal dev={props.task.mainDev} readOnly={props.readOnlyMode} /></TableCell>
                <TableCell align='center' className='cell-coll-dev-name' ><CollaboratorsSelectNormal devs={props.task.collaborators} readOnly={props.readOnlyMode} /></TableCell>
                <TableCell align='center' className='cell-status' > <StatusSelect status={props.task.status} filteringMode={false} /></TableCell>
                <TableCell align='center' className='cell-task-info' >
                    <Tooltip title={props.task.taskInfo} arrow interactive>
                        <IconButton onClick={() => { openTaskInfo(props.task) }}>
                            <ImportContactsIcon fontSize="large" color='primary' />
                        </IconButton>
                    </Tooltip>
                </TableCell>
                {props.showDatesInfo && datesInfoItems(props.task, props.readOnlyMode)}
                {props.showBranchesInfo && branchesInfoItems(props.task)}
            </TableRow>
        )
    };

    const renderThumb = ({ style, ...props }) => {
        const thumbStyle = {
            backgroundColor: `yellow`
        };
        return (
            <div
                style={{ ...style, ...thumbStyle }}
                {...props} />
        );
    }

    return (
        <>
            <TableContainer className='table-container' component={Paper}>

                {/* <Scrollbars
                    style={{ width: '100%' }}
                    //thumbSize='500px'
                    // renderView={() => <div style={{ height: '50px', width: '50px', backgroundColor: 'yellow' }} />}
                    renderThumbHorizontal={renderThumb}
                    autoHeightMin={0}
                    autoHeightMax={500}
                    className='Sasha'
                    autoHeight> */}
                <SortableCont
                    onSortEnd={onSortEnd}
                    axis="y"
                    lockAxis="y"
                    lockToContainerEdges={true}
                    lockOffset={["30%", "50%"]}
                    useDragHandle
                >
                    <Table className={classes.table} size="small">
                        <TableHead>
                            <TableRow className='filter-row'>
                                <TableCell align='center' className='cell-dragger'>
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
                                <TableCell align='center' className='cell-task-group'></TableCell>
                                <TableCell align='center' className='cell-task-sub-group'></TableCell>
                                <TableCell align='center' className='cell-task-name'></TableCell>
                                <TableCell align='center' className='cell-main-dev-name' >
                                    <DevSelect filterDevIds={filterDevIds} setFilterDevIds={setFilterDevIds} />
                                    <DevsFilteringPopOverButton
                                        filterDevIds={filterDevIds}
                                        setFilterDevIds={setFilterDevIds} />
                                </TableCell>
                                <TableCell align='center' className='cell-coll-dev-name' ></TableCell>
                                <TableCell align='center' className='cell-status' ><StatusSelect filterStatusIds={filterStatusIds} filteringMode={true} setFilterStatusIds={setFilterStatusIds} /></TableCell>
                                <TableCell align='center' className='cell-task-info' ></TableCell>
                                {props.showDatesInfo && Object.entries(tableData[0].dates).map(entry => <TableCell align='center' ></TableCell>)}
                                {props.showBranchesInfo && Object.entries(tableData[0].microServicesBranchData).slice(1).map(entry => <TableCell align='center' className='branch-info-header-cell'></TableCell>)}
                            </TableRow>
                            <TableRow className='black-row'>
                                <TableCell align='center' className='cell-dragger'></TableCell>
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
                            {tableData.map((task, index) =>
                                <SortableTableRow
                                    key={`item-${index}`}
                                    index={index}
                                    task={task}
                                    showDatesInfo={props.showDatesInfo}
                                    showBranchesInfo={props.showBranchesInfo}
                                    readOnlyMode={props.readOnlyMode}
                                />
                            )}
                        </TableBody>
                    </Table>
                </SortableCont>
                {/* </Scrollbars> */}
            </TableContainer>
            <TableContextMenu addRow={addRow} removeRow={removeRow} contextMenuAnchor={contextMenuAnchor} setContextMenuAnchor={setContextMenuAnchor} />
            <TaskInfoModal taskInfo={taskInfoModal} setTaskInfo={setTaskInfoModal} />
        </>
    );
}
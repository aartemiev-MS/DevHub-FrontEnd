import React, { useEffect, useState, useCallback } from 'react';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Tooltip from '@material-ui/core/Tooltip';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import AssignmentIcon from '@material-ui/icons/Assignment';
import SubjectIcon from '@material-ui/icons/Subject';
import Button from '@material-ui/core/Button';
import FilterListIcon from '@material-ui/icons/FilterList';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Chip from '@material-ui/core/Chip';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import FreeBreakfastIcon from '@material-ui/icons/FreeBreakfast';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';

import tableDataSource, { getStatuses, getEmptyTask, getDevs } from '../tableData'
import difference from 'lodash/difference'

import DateTimePicker from './DateTimePicker'
import DevsFilteringPopOverButton from './DevsFilteringPopOverButton'
import DevsPopOverChip from './DevsPopOverChip'
import TableContextMenu from './TableContextMenu'
import TaskInfoModal from './TaskInfoModal'
import DevChip from './DevChip'
import DevsChangingPopOver from './DevsChangingPopOver'
import StatusFilteringPopOver from './StatusFilteringPopOver'
import StatusSelect from './StatusSelect'

import { Scrollbars } from 'react-custom-scrollbars';

import SelectFromLib from 'react-select'


import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { SortableHandle } from "react-sortable-hoc";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
        backgroundColor: 'black'
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
    const [tasksData, setTasksData] = useState(tableDataSource())
    const [tableRowsData, setTableRowsData] = useState([])
    const [taskModal, setTaskModal] = useState(null)

    const [filterStatusIds, setFilterStatusIds] = useState([])
    const [filterMainDevIds, setMainFilterDevIds] = useState([])
    const [filterCollDevIds, setCollFilterDevIds] = useState([])
    const [filterShowOnHolds, setFilterShowOnHolds] = useState(true);

    const [readOnlyMode, setReadOnlyMode] = useState(true);
    const [showBranchesInfo, setShowBranchesInfo] = useState(false);
    const [showDatesInfo, setShowDatesInfo] = useState(false);

    // const [dragHandlerData(), setDragHandlerData()] = useState(null);

    useEffect(() => {
        document.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });
    }, [])

    useEffect(() => {
        console.log('tableData refreshed tasksData:', tasksData, ' newTableRowsData:', getTableRowsData(tasksData))
        setTableRowsData(getTableRowsData(tasksData))
    }, [tasksData])

    useEffect(() => {
        filterTableData()
    }, [filterStatusIds, filterMainDevIds, filterCollDevIds, filterShowOnHolds])

    const filterTableData = () => {
        let newTableData = tableDataSource()

        if (filterStatusIds.length > 0) newTableData = newTableData.filter(item => filterStatusIds.includes(item.status.id)) //statuses filter

        if (filterMainDevIds.length > 0) newTableData = newTableData.filter(item => filterMainDevIds.includes(item.mainDev.id)) //mainDev filter. if no option selected then no filtering required

        if (filterCollDevIds.length > 0) newTableData = newTableData.filter(tableDataItem => tableDataItem.collaborators.some(collDev => filterCollDevIds.includes(collDev.id))) //collaborator dev filter. if no option selected then no filtering required

        if (!filterShowOnHolds) newTableData = newTableData.filter(item => !item.tags.includes('onHold'))

        setTasksData(newTableData)
    }

    const setDragHandlerData = data => window.dragHandlerData = data
    const dragHandlerData = () => window.dragHandlerData

    const classes = useStyles();

    const openTaskInfo = task => {
        setTaskModal(task)
    }

    const datesInfoItems = (task, readOnlyMode, showBranchesInfo) => {
        const datesArray = Object.entries(task.dates)
        return datesArray.map((entry, i) =>
            <TableCell className={'cell-date-picker' + (showBranchesInfo && i === datesArray.length - 1 ? ' group-edge' : '')} align='center' >
                <DateTimePicker dateName={capitalizeFirstLetter(entry[0])} date={entry[1]} readOnly={readOnlyMode} />
            </TableCell>)
    }
    const branchesInfoItems = task => {
        let isCellGroupHighlighted = true

        return Object.entries(task.microServicesBranchData).slice(1).map((entry, i) => {
            let className = 'branch-info-cell'
            const isGroupEdgeCell = entry[0] === 'MAService' || entry[0] === 'Scheduling'

            if (entry[1] === 'demo') className += ' default-branch-name'
            if (isGroupEdgeCell) className += ' group-edge'
            if (isCellGroupHighlighted) className += ' highlighted-branches-cell'

            if (isGroupEdgeCell) isCellGroupHighlighted = !isCellGroupHighlighted

            return <TableCell align='center' className={className}>{entry[1]}</TableCell>
        })
    }

    const datesInfoHeaders = () => tasksData.length > 0 && Object.entries(tasksData[0].dates).map(entry => <TableCell align='center' >{capitalizeFirstLetter(entry[0])}</TableCell>)
    const branchesInfoHeaders = () => tasksData.length > 0 && Object.entries(tasksData[0].microServicesBranchData).slice(1).map(entry => <TableCell align='center' className='branch-info-header-cell'>{entry[0]}</TableCell>)

    const handleBranchesInfoChange = e => setShowBranchesInfo(!showBranchesInfo)
    const handleDatesInfoChange = e => setShowDatesInfo(!showDatesInfo)
    const handleReadOnlyModeChange = e => setReadOnlyMode(!readOnlyMode)
    const handleFilterShowOnHoldsChange = e => setFilterShowOnHolds(!filterShowOnHolds)

    const handleRowOnContextMenu = (e, taskId, copyTaskGroup, copyTaskSubGroup) => {
        e.stopPropagation()
        e.preventDefault()

        setContextMenuAnchor({
            xPos: e.pageX,
            yPos: e.pageY,
            taskId: taskId,
            isOnHold: getTaskById(taskId).tags.includes('onHold'),
            copyTaskGroup: copyTaskGroup,
            copyTaskSubGroup: copyTaskSubGroup
        })
    }

    const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);

    const addRow = (taskId, addBelow, copyTaskGroup, copyTaskSubGroup) => {
        let updatedTasksData = Object.values(Object.assign({}, tasksData))

        const sourceTask = updatedTasksData.find(task => task.id === taskId)
        const newTaskGroup = copyTaskGroup ? sourceTask.taskGroup : ''
        const newTaskSubGroup = copyTaskSubGroup ? sourceTask.taskSubGroup : ''
        const newRowPositionIndex = updatedTasksData.map(task => task.id).indexOf(taskId) + (addBelow ? 1 : 0)
        updatedTasksData.splice(newRowPositionIndex, 0, getEmptyTask(tasksData.length, sourceTask.mainDev, newTaskGroup, newTaskSubGroup))

        setTasksData(updatedTasksData)
    }

    const removeRow = taskId => {
        let updatedTaskData = tasksData
        const rowPositionIndex = updatedTaskData.map(task => task.id).indexOf(taskId)

        updatedTaskData.splice(rowPositionIndex, 1)

        setTasksData(updatedTaskData)
    }

    const handleUpdateTaskNameAndInfo = updatedTask => {
        let newTableData = Object.values({ ...tasksData })
        const taskIndex = newTableData.map(task => task.id).indexOf(updatedTask.id)

        newTableData[taskIndex].taskInfo = updatedTask.taskInfo
        newTableData[taskIndex].taskName = updatedTask.taskName
        newTableData[taskIndex].taskNotes = updatedTask.taskNotes
        setTasksData(newTableData)
    }

    const handleOnHoldAction = (taskIndex, removeFromHold) => {
        let newTableData = Object.values({ ...tasksData })

        if (removeFromHold)
            newTableData[taskIndex].tags = newTableData[taskIndex].tags.filter(tag => tag !== 'onHold')
        else
            newTableData[taskIndex].tags.push('onHold')

        setTasksData(newTableData)
        filterTableData()
    }

    const SortableCont = SortableContainer(({ children }) => {
        return <tbody>{children}</tbody>;
    });

    const onSortStart = ({ node, index, collection, isKeySorting }) => {
        getTableDOM().classList.add("active-drag-mode")

        let dragAffectedRowIndexes = getDragAffectedRowIndexes()

        getCurrentRowsDOM().forEach((row, index) => {
            if (dragAffectedRowIndexes.includes(index)) row.classList.add("active-drag-mode-row")
        })

        let shadowsClass
        switch (dragAffectedRowIndexes.length) {
            case 1:
                //produces null to have no shadow
                break;
            case 2:
                shadowsClass = 'shadow-1'
                break;
            case 3:
                shadowsClass = 'shadow-2'
                break;
            default:
                shadowsClass = 'shadow-many'
                break;
        }
        getMainActiveRowDOM().classList.remove('shadow-1', 'shadow-2', 'shadow-many') //remove old shadows
        if (shadowsClass) getMainActiveRowDOM().classList.add(shadowsClass) //set new one if need
    }

    const onSortEnd = useCallback(({ oldIndex: oldRowIndex, newIndex: newRowIndex }) => {
        let dragAffectedRowIndexes = getDragAffectedRowIndexes()
        let originalPlace = oldRowIndex < newRowIndex ? newRowIndex + 1 : newRowIndex
        console.log('old:', oldRowIndex, ' new:', newRowIndex, ' originalPlace:', originalPlace)


        //console.log('onSortEnd dragAffectedRowIndexes:', dragAffectedRowIndexes, 'newRowIndex before:', newRowIndex)

        if (oldRowIndex !== newRowIndex) {
            const newTableRowsData = getTableRowsData(tasksData)

            if (dragAffectedRowIndexes.length === 1) {
                const movingTask = newTableRowsData.splice(oldRowIndex, 1)[0]
                newTableRowsData.splice(newRowIndex, 0, movingTask)

                if (newRowIndex === 0) {
                    newTableRowsData[newRowIndex].mainDev = newTableRowsData[1].isBorder ? newTableRowsData[1].prevDev : newTableRowsData[1].mainDev
                } else {
                    const newDevSourceRow = newTableRowsData[newRowIndex - 1]
                    if (newDevSourceRow) newTableRowsData[newRowIndex].mainDev = newDevSourceRow.isBorder ? newDevSourceRow.nextDev : newDevSourceRow.mainDev
                }
            } else {
                // let movingTasks = []
                // let newDev

                // if (newRowIndex === 0) {
                //     newDev = newTableRowsData[1].isBorder ? newTableRowsData[1].prevDev : newTableRowsData[1].mainDev
                // } else {
                //     const newDevSourceRow = newTableRowsData[newRowIndex]

                //     if (newDevSourceRow) {
                //         if (newDevSourceRow.isBorder)
                //             if (oldRowIndex < newRowIndex)
                //                 newDev = newDevSourceRow.nextDev
                //             else
                //                 newDev = newDevSourceRow.prevDev
                //         else
                //             newDev = newDevSourceRow.mainDev
                //     }
                // }

                // dragAffectedRowIndexes.filter(rowIndex => rowIndex < newRowIndex && rowIndex !== oldRowIndex).forEach(rowIndex => newRowIndex--)

                // dragAffectedRowIndexes.slice().reverse().forEach(affectedRowIndex => {
                //     const movingTask = newTableRowsData.splice(affectedRowIndex, 1)[0]

                //     movingTask.mainDev = newDev

                //     movingTasks.push(movingTask)
                // })
                // //  console.log('newRowIndex after:', newRowIndex, 'new dev:', newDev)
                // newTableRowsData.splice(newRowIndex, 0, ...movingTasks)
                // // console.log('newTableRowsData:', newTableRowsData)

                //way 2
                let newDev
                let prevTaskPriority

                if (newTableRowsData[originalPlace].isBorder) {
                    newDev = newTableRowsData[originalPlace].prevDev
                    prevTaskPriority = 0

                } else {
                    newDev = newTableRowsData[originalPlace].mainDev
                    prevTaskPriority = newTableRowsData[originalPlace].devPriority
                }

                const priorityShiftNumber = dragAffectedRowIndexes.count - dragAffectedRowIndexes.map(rowIndex => newTableRowsData[rowIndex].mainDev.id === newDev.id).filter(alreadyBelongsToThisDev => alreadyBelongsToThisDev).length

                newTableRowsData.map((rowData, i) => {
                    if (dragAffectedRowIndexes.includes(i)) {
                        rowData.mainDev = newDev
                        rowData.devPriority = prevTaskPriority
                        prevTaskPriority++
                    } else if (!rowData.isBorder && rowData.mainDev.id === newDev.id) {
                        rowData.devPriority += priorityShiftNumber
                    }
                    return rowData
                }).filter(row => !row.isBorder).sort(task => task.mainDev.priority)

                console.log('new dev:', newDev.name)
            }

            setTasksData(newTableRowsData.filter(row => !row.isBorder));
        } else {
            getTableDOM().classList.remove("active-drag-mode")
            getCurrentRowsDOM().forEach(row => row.classList.remove('active-drag-mode-row'))
        }
    }, []);

    const getDragAffectedRowIndexes = () => {
        const tableRowsDataSource = tableRowsData.length > 0 ? tableRowsData : dragHandlerData().tableRowsData

        switch (dragHandlerData().mode) {
            case 0:
                return tableRowsDataSource.map((row, i) => !row.isBorder && row.mainDev.id === dragHandlerData().task.mainDev.id ? i : null).filter(index => index !== null) //with out !== null it ignores [0]

            case 1:
                return tableRowsDataSource.map((row, i) => !row.isBorder && row.taskGroup === dragHandlerData().task.taskGroup ? i : null).filter(index => index !== null) //with out !== null it ignores [0]

            case 2:
                return tableRowsDataSource.map((row, i) => !row.isBorder && row.taskSubGroup === dragHandlerData().task.taskSubGroup ? i : null).filter(index => index !== null) //with out !== null it ignores [0]

            case 3:
                return tableRowsDataSource.map((row, i) => !row.isBorder && row.id === dragHandlerData().task.id ? i : null).filter(index => index !== null) //with out !== null it ignores [0]
        }
    }

    const getMainActiveRowDOM = () => document.getElementsByClassName('active-drag-mode-row-main')[0]
    const getTableDOM = () => document.getElementById('tasks-table')
    const getCurrentRowsDOM = () => Array.from(getTableDOM().children[1].children)

    const getTableRowsData = (tasksData) => {
        let devs = getDevs()
        let newTableRowsData = []

        devs.forEach((dev, index) => {
            const devTasks = tasksData.filter(task => task.mainDev.id === dev.id)

            devTasks.forEach(task => newTableRowsData.push(task))

            if (index !== devs.length - 1)
                newTableRowsData.push({
                    isBorder: true,
                    prevDev: dev,
                    nextDev: devs[index + 1]
                })
        })

        return newTableRowsData
    }
    const getTaskById = id => tasksData.find(task => task.id === id)

    const onMouseEnterDragHandler = (task, mode) => setDragHandlerData({ task: task, mode: mode, tableRowsData: tableRowsData })

    const arrayMoveMutate = (array, from, to) => {
        array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);
    };

    const arrayMove = (array, from, to) => {
        array = array.slice();
        arrayMoveMutate(array, from, to);
        return array;
    };

    const SortableTableRow = SortableElement(props => props.isBorder ? <SortableTableBorderRowElement {...props} /> : <SortableTableRowElement {...props} />);

    const RowHandler = SortableHandle(props => <DragIndicatorIcon onMouseEnter={e => onMouseEnterDragHandler(props.task, props.mode)} style={{ cursor: 'grab' }} />);

    const SortableTableRowElement = props => {


        const handleSaveDevs = newDevs => {
            let newTableData = Object.values({ ...tasksData })

            newTableData[props.taskIndex].collaborators = newDevs
            setTasksData(newTableData)
        }

        const renderActionButtons = () =>
            <ButtonGroup className='actions-button-group' variant="contained" size="small" color="primary">
                {props.task.status.actions.map(action => {
                    let className
                    if (action === 'Pass') className += ' green-button'
                    return <Button color={action === 'Fail' ? 'secondary' : "primary"} className={className}>{action}</Button>
                })}
            </ButtonGroup>


        const handleMainDevSelected = dev => {
            let newTableData = Object.values({ ...tasksData })

            newTableData[props.taskIndex].mainDev = dev
            setTasksData(newTableData)
        }

        const handleOnChangeTaskStatus = (taskId, newStatusId) => {
            let newTableData = Object.values({ ...tasksData })
            const taskIndex = newTableData.map(task => task.id).indexOf(taskId)

            newTableData[taskIndex].status = getStatuses().find(status => status.id === newStatusId)
            setTasksData(newTableData)
            filterTableData()
        }

        return (
            <TableRow className={'task-row'} key={props.task.id} onContextMenu={e => { handleRowOnContextMenu(e, props.task.id, false, false) }}>
                <TableCell align='center' className='cell-dragger'><RowHandler task={props.task} mode={0} /></TableCell>
                <TableCell align='center' className='cell-main-dev-name'>
                    <DevsPopOverChip
                        readOnly={readOnlyMode}
                        dev={props.task.mainDev}
                        handleDevSelected={handleMainDevSelected}
                        devsSource={getDevs().filter(dev => dev.id !== props.task.mainDev.id)}
                    />
                </TableCell>
                <TableCell align='center' className='cell-priority'>
                    {props.task.tags.includes('onHold') ? <PauseCircleFilledIcon color='action' /> : props.task.devPriority}
                </TableCell>
                <TableCell className='cell-task-group' onContextMenu={e => { handleRowOnContextMenu(e, props.task.id, true, false) }}><div><RowHandler task={props.task} mode={1} />{props.task.taskGroup}</div></TableCell>
                <TableCell className='cell-task-sub-group' onContextMenu={e => { handleRowOnContextMenu(e, props.task.id, true, true) }}><div><RowHandler task={props.task} mode={2} />{props.task.taskSubGroup}</div></TableCell>
                <TableCell className='cell-task-name'>
                    <div><RowHandler task={props.task} mode={3} />
                        {readOnlyMode ?
                            props.task.taskName :
                            <TextField defaultValue={props.task.taskName} />}
                    </div>
                </TableCell>
                <TableCell align='center' className='cell-collaborators'>
                    <DevsChangingPopOver
                        readOnlyMode={readOnlyMode}
                        handleSaveDevs={handleSaveDevs}
                        taskMainDevId={props.task.mainDev.id}
                        taskCollaborators={props.task.collaborators}
                    />
                </TableCell>
                <TableCell align='center' className='cell-status'>
                    {readOnlyMode ?
                        props.task.status.name :
                        <StatusSelect
                            currentStatus={props.task.status}
                            taskId={props.task.id}
                            handleOnChangeTaskStatus={handleOnChangeTaskStatus} />}
                </TableCell>
                <TableCell align='center' className='cell-action' >
                    {renderActionButtons()}
                </TableCell>
                <TableCell align='center' className={'cell-task-info' + (showDatesInfo || showBranchesInfo ? ' group-edge' : '')}>
                    <Tooltip title={props.task.taskInfo} arrow interactive>
                        <IconButton onClick={() => { openTaskInfo(props.task) }}>
                            <ImportContactsIcon fontSize="medium" color='primary' />
                        </IconButton>
                    </Tooltip>
                </TableCell>
                { showDatesInfo && datesInfoItems(props.task, readOnlyMode, showBranchesInfo)}
                { showBranchesInfo && branchesInfoItems(props.task)}
            </TableRow >
        )
    };

    const SortableTableBorderRowElement = props => {
        let emptyCells = []
        const cellsCount = 10 + (showDatesInfo ? 5 : 0) + (showBranchesInfo ? 15 : 0)

        for (let i = 0; i < cellsCount; i++) {
            emptyCells.push(<TableCell >
                {/* <div style={{ background: `linear-gradient(transparent 100%, ${(props.prevDev.color)}) 30%` }} />
                <div style={{ background: `linear-gradient(${(props.nextDev.color)},transparent)` }} /> */}
                <div style={{ backgroundColor: props.prevDev.color }} />
                <div style={{ backgroundColor: props.nextDev.color }} />
            </TableCell>)
        }

        return <TableRow className='border-row'>{emptyCells}</TableRow>
    }

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

    const renderTableRows = props => {
        if (tableRowsData.length === getDevs().length - 1)
            return <TableRow className='no-tasks-row'><TableCell align='center' className='cell-dragger'><div className='no-tasks-row'>No availible tasks satisfy current filtration</div></TableCell><TableCell /></TableRow>
        else
            return tableRowsData.map((row, rowIndex) =>
                <SortableTableRow
                    key={`item-${rowIndex}`}
                    index={rowIndex}
                    isBorder={row.isBorder}
                    prevDev={row.prevDev}
                    nextDev={row.nextDev}
                    taskIndex={row.isBorder ? null : tasksData.map(task => task.id).indexOf(row.id)}
                    task={row}
                    showDatesInfo={showDatesInfo}
                    showBranchesInfo={showBranchesInfo}
                    readOnlyMode={readOnlyMode}
                />
            )
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
                    onSortStart={onSortStart}
                    axis="y"
                    lockAxis="y"
                    // lockToContainerEdges={true}
                    //lockOffset={["30%", "50%"]}
                    useDragHandle
                    helperClass='active-drag-mode-row-main active-drag-mode-row'
                >
                    <Table className={classes.table} size="small" id='tasks-table'>
                        <TableHead>
                            {/* <TableRow className='filter-row'>
                                <TableCell align='center' className='cell-dragger'></TableCell>
                                <TableCell align='center' className='cell-main-dev-name' ></TableCell>
                                <TableCell align='center' className='cell-priority'></TableCell>
                                <TableCell align='center' className='cell-task-group'></TableCell>
                                <TableCell align='center' className='cell-task-sub-group'></TableCell>
                                <TableCell align='center' className='cell-task-name'></TableCell>
                                <TableCell align='center' className='cell-collaborators' ></TableCell>
                                <TableCell align='center' className='cell-status' ></TableCell>
                                <TableCell align='center' className='cell-action' ></TableCell>
                                <TableCell align='center' className='cell-task-info' ></TableCell>
                                {showDatesInfo && datesInfoHeaders()}
                                {showBranchesInfo && branchesInfoHeaders()}
                            </TableRow> */}
                            <TableRow className='black-row'>
                                <TableCell align='center' className='cell-dragger'>
                                    <div>
                                        <IconButton className='filtering-header-icon' onClick={handleReadOnlyModeChange}>
                                            <EditIcon fontSize="small" color={readOnlyMode ? 'disabled' : 'primary'} />
                                        </IconButton>
                                    </div>
                                </TableCell>
                                <TableCell align='center' className='cell-main-dev-name' >
                                    <IconButton className='filtering-header-icon' onClick={() => { }}>
                                        <FreeBreakfastIcon fontSize="small" color='disabled' />
                                    </IconButton>
                                    Main
                                    <DevsFilteringPopOverButton
                                        filterDevIds={filterMainDevIds}
                                        setFilterDevIds={setMainFilterDevIds}
                                        tasksData={tasksData} />
                                </TableCell>
                                <TableCell align='center' className='cell-priority'>
                                    <IconButton className='small-view-button' onClick={handleFilterShowOnHoldsChange}>
                                        <PauseCircleFilledIcon fontSize="small" color={filterShowOnHolds ? 'primary' : 'disabled'} />
                                    </IconButton>
                                </TableCell>
                                <TableCell align='center' className='cell-task-group'>Task Group</TableCell>
                                <TableCell align='center' className='cell-task-sub-group'>Task Sub Group</TableCell>
                                <TableCell align='center' className='cell-task-name'>Task Name</TableCell>
                                <TableCell align='center' className='cell-collaborators' >
                                    Collaborators
                                    <DevsFilteringPopOverButton
                                        filterDevIds={filterCollDevIds}
                                        setFilterDevIds={setCollFilterDevIds}
                                        tasksData={tasksData}
                                        shortForm />
                                </TableCell>
                                <TableCell align='center' className='cell-status' >
                                    Status
                                    <StatusFilteringPopOver filterStatusIds={filterStatusIds} setFilterStatusIds={setFilterStatusIds} />
                                </TableCell>
                                <TableCell align='center' className='cell-action' >
                                    <div>
                                        <IconButton className='small-view-button' onClick={handleBranchesInfoChange}>
                                            <AccountTreeIcon fontSize="small" color={showBranchesInfo ? 'primary' : 'disabled'} />
                                        </IconButton>
                                        <IconButton className='small-view-button' onClick={handleDatesInfoChange}>
                                            <EventAvailableIcon fontSize="small" color={showDatesInfo ? 'primary' : 'disabled'} />
                                        </IconButton>
                                    </div>
                                </TableCell>
                                <TableCell align='center' className='cell-task-info' >Info</TableCell>
                                {showDatesInfo && datesInfoHeaders()}
                                {showBranchesInfo && branchesInfoHeaders()}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {renderTableRows(props)}
                        </TableBody>
                    </Table>
                </SortableCont>
                {/* </Scrollbars> */}
            </TableContainer>
            {(!showDatesInfo && !showBranchesInfo) &&
                <div className='big-view-buttons-wrap'>
                    <div>You can select one of the following views to show more data.</div>
                    <IconButton onClick={handleBranchesInfoChange} ><AccountTreeIcon color='primary' />Git section</IconButton>
                    <IconButton onClick={handleDatesInfoChange}><EventAvailableIcon color='primary' />Dates section</IconButton>
                </div>
            }
            {contextMenuAnchor && <TableContextMenu
                addRow={addRow}
                removeRow={removeRow}
                contextMenuAnchor={contextMenuAnchor}
                setContextMenuAnchor={setContextMenuAnchor}
                onHoldAction={handleOnHoldAction}
            />}
            {taskModal && <TaskInfoModal
                taskModal={taskModal}
                setTaskModal={setTaskModal}
                readOnlyMode={readOnlyMode}
                saveTask={handleUpdateTaskNameAndInfo}
            />}

        </>
    );
}
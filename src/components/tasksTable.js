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
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import AssignmentIcon from '@material-ui/icons/Assignment';
import SubjectIcon from '@material-ui/icons/Subject';
import Button from '@material-ui/core/Button';
import FilterListIcon from '@material-ui/icons/FilterList';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Chip from '@material-ui/core/Chip';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import FreeBreakfastIcon from '@material-ui/icons/FreeBreakfast';

import tableDataSource, { getStatuses, getEmptyTask, getDevs } from '../tableData'
import difference from 'lodash/difference'

import DateTimePicker from './DateTimePicker'
import DevsFilteringPopOverButton from './DevsFilteringPopOverButton'
import DevsPopOverChip from './DevsPopOverChip'
import TableContextMenu from './TableContextMenu'
import TaskInfoModal from './TaskInfoModal'
import DevChip from './DevChip'

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
    const [tasksData, setTasksData] = useState(tableDataSource())
    const [tableRowsData, setTableRowsData] = useState([])
    const [taskModal, setTaskModal] = useState(null)

    const [filterStatusIds, setFilterStatusIds] = useState(getStatuses().map(status => status.id))
    const [filterMainDevIds, setMainFilterDevIds] = useState([])
    const [filterCollDevIds, setCollFilterDevIds] = useState([])
    const [filterShowOnHolds, setFilterShowOnHolds] = useState(true);

    const [readOnlyMode, setReadOnlyMode] = useState(true);
    const [showBranchesInfo, setShowBranchesInfo] = useState(false);
    const [showDatesInfo, setShowDatesInfo] = useState(false);

    useEffect(() => {
        document.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });
    }, [])

    useEffect(() => {
        console.log('tableData refreshed tasksData:', tasksData)
        setTableRowsData(getTableRowsData(tasksData))
    }, [tasksData])

    useEffect(() => {
        var rows = Array.from(document.getElementsByClassName('task-row'))

        rows && rows.forEach((row, i) => {
            row.addEventListener("contextmenu", (event) => {
                event.preventDefault();
                const xPos = event.pageX
                const yPos = event.pageY
                const isOnHold = tasksData[i].tags.includes('onHold')

                setContextMenuAnchor({ xPos: xPos, yPos: yPos, taskIndex: i, isOnHold: isOnHold })
            });
        });
    }, [contextMenuAnchor, tasksData, tableRowsData, filterStatusIds, filterMainDevIds, filterCollDevIds, taskModal, filterShowOnHolds])

    useEffect(() => {
        filterTableData()
    }, [filterStatusIds, filterMainDevIds, filterCollDevIds, filterShowOnHolds])

    const filterTableData = () => {
        console.log('filterTableData triggered')
        let newTableData = tableDataSource()

        newTableData = newTableData.filter(item => filterStatusIds.includes(item.status.id)) //statuses filter

        if (filterMainDevIds.length > 0) newTableData = newTableData.filter(item => filterMainDevIds.includes(item.mainDev.id)) //mainDev filter. if no option selected then no filtering required

        if (filterCollDevIds.length > 0) newTableData = newTableData.filter(tableDataItem => tableDataItem.collaborators.some(collDev => filterCollDevIds.includes(collDev.id))) //collaborator dev filter. if no option selected then no filtering required

        if (!filterShowOnHolds) newTableData = newTableData.filter(item => !item.tags.includes('onHold'))

        setTasksData(newTableData)
    }

    const classes = useStyles();

    const openTaskInfo = task => {
        setTaskModal(task)
    }

    const datesInfoItems = (task, readOnlyMode, showBranchesInfo) => {
        const isLastDateCell = i => Object.entries(task.dates).length - 1 === i

        return Object.entries(task.dates).map((entry, i) =>
            <TableCell className={'cell-date-picker highlighted-cell' + (!showBranchesInfo && isLastDateCell(i) ? ' right-edge' : '')} align='center' >
                <DateTimePicker dateName={capitalizeFirstLetter(entry[0])} date={entry[1]} readOnly={readOnlyMode} />
            </TableCell>)
    }
    const branchesInfoItems = (task, datesDisplayed) => {
        let isCellGroupHighlighted = !datesDisplayed
        const isLastBranchInfoCell = i => Object.entries(task.microServicesBranchData).length - 2 === i //-2 because we slice(1)

        return Object.entries(task.microServicesBranchData).slice(1).map((entry, i) => {
            let className = 'branch-info-cell'
            const isGroupEdgeCell = entry[0] === 'MAService' || entry[0] === 'Scheduling'

            if (entry[1] === 'demo') className += ' default-branch-name'
            if (isGroupEdgeCell) className += ' group-edge'
            if (isCellGroupHighlighted) className += ' highlighted-cell'
            if (isLastBranchInfoCell(i)) className += ' right-edge'

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

    const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);

    const addRow = atPotition => {
        let updatedTableData = Object.assign({}, tasksData)

        updatedTableData = Object.values(updatedTableData)
        updatedTableData.splice(atPotition, 0, getEmptyTask())

        setTasksData(updatedTableData)
    }

    const removeRow = atPotition => {
        let updatedTaskData = tasksData

        updatedTaskData.splice(atPotition, 1)

        setTasksData(updatedTaskData)
    }

    const handleUpdateTaskNameAndInfo = updatedTask => {
        let newTableData = Object.values({ ...tasksData })
        const taskIndex = newTableData.map(task => task.id).indexOf(updatedTask.id)

        newTableData[taskIndex].taskInfo = updatedTask.taskInfo
        newTableData[taskIndex].taskName = updatedTask.taskName
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
        document.getElementById('tasks-table').classList.add("active-drag-mode")
    }

    const getTableRowsData = (tasksData) => {
        let devs = getDevs()
        let newTableRowsData = []

        devs.forEach((dev, index) => {
            const devTasks = tasksData.filter(task => task.mainDev.id === dev.id)
            const bottomRoundItemIndex = devTasks.length - 1

            devTasks.forEach((task, i) => {
                task.topRounded = i === 0
                task.bottomRounded = i === bottomRoundItemIndex
                newTableRowsData.push(task)
            })

            if (index !== devs.length - 1)
                newTableRowsData.push({
                    isBorder: true,
                    prevDev: dev,
                    nextDev: devs[index + 1]
                })
        })

        return newTableRowsData
    }

    const onSortEnd = useCallback(({ oldIndex: oldRowIndex, newIndex: newRowIndex }) => {
        if (oldRowIndex !== newRowIndex) {
            const newTableRowsData = getTableRowsData(tasksData)
            const movingTask = newTableRowsData.splice(oldRowIndex, 1)[0]
            newTableRowsData.splice(newRowIndex, 0, movingTask)

            if (newRowIndex === 0) {
                newTableRowsData[newRowIndex].mainDev = newTableRowsData[1].isBorder ? newTableRowsData[1].prevDev : newTableRowsData[1].mainDev
            } else {
                const newDevSourceRow = newTableRowsData[newRowIndex - 1]
                if (newDevSourceRow) newTableRowsData[newRowIndex].mainDev = newDevSourceRow.isBorder ? newDevSourceRow.nextDev : newDevSourceRow.mainDev

            }

            setTasksData(newTableRowsData.filter(row => !row.isBorder));
        } else {
            document.getElementById('tasks-table').classList.remove("active-drag-mode")
        }
    }, []);

    const arrayMoveMutate = (array, from, to) => {
        array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);
    };

    const arrayMove = (array, from, to) => {
        array = array.slice();
        arrayMoveMutate(array, from, to);
        return array;
    };

    const SortableTableRow = SortableElement(props => props.isBorder ? <SortableTableBorderRowElement {...props} /> : <SortableTableRowElement {...props} />);

    const RowHandler = SortableHandle(() => <DragIndicatorIcon style={{ cursor: 'grab' }} />);

    const SortableTableRowElement = props => {

        const onDeleteCollaborator = removingDev => {
            let newTableData = Object.values({ ...tasksData })

            const newCollaborators = newTableData[props.taskIndex].collaborators.filter(dev => dev.id !== removingDev.id)
            newTableData[props.taskIndex].collaborators = newCollaborators

            setTasksData(newTableData)
        }

        const renderCollaboratorsCell = props => {
            const devsSource = []
            getDevs().forEach(dev => {
                //if (!props.task.collaborators) { debugger }
                const devIsAlreadyCollaborator = props.task.collaborators.map(collDev => collDev.id).includes(dev.id)

                !devIsAlreadyCollaborator && devsSource.push(dev)
            })

            const handleMainCollaboratorSelected = dev => {
                let newTableData = Object.values({ ...tasksData })

                newTableData[props.taskIndex].collaborators.push(dev)
                setTasksData(newTableData)
            }

            return [
                props.task.collaborators.map(dev =>
                    <DevChip
                        dev={dev}
                        shortForm
                        onDelete={readOnlyMode ? null : onDeleteCollaborator}
                    />),
                !readOnlyMode && <DevsPopOverChip
                    devsSource={devsSource}
                    handleDevSelected={handleMainCollaboratorSelected}
                    empty />]
        }


        const handleMainDevSelected = dev => {
            let newTableData = Object.values({ ...tasksData })

            newTableData[props.taskIndex].mainDev = dev
            setTasksData(newTableData)
        }
        return (
            <TableRow className={'task-row' + (props.task.topRounded ? ' top-rounded' : '') + (props.task.bottomRounded ? ' bottom-rounded' : '')} key={props.task.id}>
                <TableCell align='center' className='cell-dragger'><RowHandler /></TableCell>
                <TableCell align='center' className='cell-main-dev-name'>
                    <DevsPopOverChip
                        readOnly={readOnlyMode}
                        dev={props.task.mainDev}
                        handleDevSelected={handleMainDevSelected}
                        devsSource={getDevs().filter(dev => dev.id !== props.task.mainDev.id)}
                    />
                </TableCell>
                <TableCell align='center' className='cell-priority'>
                    {props.task.tags.includes('onHold') && <PauseCircleFilledIcon color='action' />}
                </TableCell>
                <TableCell align='center' className='cell-task-group'>{props.task.taskGroup}</TableCell>
                <TableCell align='center' className='cell-task-sub-group'>{props.task.taskSubGroup}</TableCell>
                <TableCell align='center' className='cell-task-name'>
                    {readOnlyMode ?
                        props.task.taskName :
                        <TextField defaultValue={props.task.taskName} />}
                </TableCell>
                <TableCell align='center' className='cell-collaborators'>
                    {renderCollaboratorsCell(props)}
                </TableCell>
                <TableCell align='center' className='cell-status'>
                    {readOnlyMode ?
                        props.task.status.name :
                        <StatusSelect status={props.task.status} filteringMode={false} />}
                </TableCell>
                <TableCell align='center' className='cell-action' >

                    <ButtonGroup className='actions-button-group' variant="contained" size="small" color="primary">
                        {props.task.status.actions.map(action => <Button color="primary">{action}</Button>)}
                    </ButtonGroup>
                </TableCell>
                <TableCell align='center' className={'cell-task-info' + (!showDatesInfo && !showBranchesInfo ? ' right-edge' : ' group-edge')}>
                    <Tooltip title={props.task.taskInfo} arrow interactive>
                        <IconButton onClick={() => { openTaskInfo(props.task) }}>
                            <ImportContactsIcon fontSize="medium" color='primary' />
                        </IconButton>
                    </Tooltip>
                </TableCell>
                {showDatesInfo && datesInfoItems(props.task, readOnlyMode, showBranchesInfo)}
                {showBranchesInfo && branchesInfoItems(props.task, showDatesInfo)}
            </TableRow>
        )
    };

    const SortableTableBorderRowElement = props => {
        let emptyCells = []
        const cellsCount = 10 + (showDatesInfo ? 5 : 0) + (showBranchesInfo ? 15 : 0)

        for (let i = 0; i < cellsCount; i++) {
            emptyCells.push(<TableCell >
                <div style={{ background: `linear-gradient(transparent 100%,${(props.prevDev.color)}) 30%` }} />
                <div style={{ background: `linear-gradient(${(props.nextDev.color)},transparent)` }} />
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

    const renderTestCollsSelect = () => {
        const devs = getDevs()
        const options = devs.map(dev => { return { value: { dev }, label: dev.name } })

        const formatOptionLabel = ({ value, label }) => {
            return <DevChip
                dev={value.dev}
            />
        }

        // const currentTags = getDevs()
        // const handleChange = (options) => {
        //     const optionsValue = options.map(({ value }) => value)
        //     if (this.currentTags.length < options.length) {
        //         const addedElement = difference(optionsValue, this.currentTags)[0]
        //         this.currentTags.push(addedElement)
        //         console.log("addedElement", addedElement)
        //         //call custom add event here
        //     }
        //     else {
        //         let removedElement = difference(this.currentTags, optionsValue)[0]
        //         console.log("removedElement", removedElement)
        //         // call custom removed event here
        //         let index = this.currentTags.indexOf(removedElement)
        //         if (index !== -1) {
        //             this.currentTags.splice(index, 1)
        //         }
        //     }
        // }

        return <SelectFromLib
            options={options}
            //controlShouldRenderValue={false}
            closeMenuOnSelect={false}
            isClearable={false}
            //formatOptionLabel={formatOptionLabel} works
            isMulti
            //controlShouldRenderValue
            //filterOption={() => true}
            //filterOption
            // handleChange={handleChange}
            placeholder='Collaborators' />
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
                    taskIndex={0}
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
                    helperClass='active-drag-mode-row'
                >
                    <Table className={classes.table} size="small" id='tasks-table'>
                        <TableHead>
                            <TableRow className='filter-row'>
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
                            </TableRow>
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
                                    <IconButton className='filtering-header-icon' onClick={() => { }}>
                                        <FilterListIcon fontSize="small" color='primary' />
                                    </IconButton>
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
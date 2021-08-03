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
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import BuildIcon from '@material-ui/icons/Build';

import { getTasksData, getStatuses, getDevs } from '../tableData'
import difference from 'lodash/difference'

import DateTimePicker from './DateTimePicker'
import DevsFilteringPopOverButton from './DevsFilteringPopOverButton'
import DevsPopOverChip from './DevsPopOverChip'
import StatusChip from "./StatusChip"
import TableContextMenu from './TableContextMenu'
import TaskInfoModal from './TaskInfoModal'
import DevsChangingPopOver from './DevsChangingPopOver'
import StatusFilteringPopOver from './StatusFilteringPopOver'
import GroupFilteringPopOver from './GroupFilteringPopOver'
import StatusSelect from './StatusSelect'
import TaskGroupSelect from './TaskGroupSelect'

import { Scrollbars } from 'react-custom-scrollbars';

import SelectFromLib from 'react-select'

import { v4 as generateGuid } from 'uuid';

import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { SortableHandle } from "react-sortable-hoc";

import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { setMountData, addTask, removeTask, updateTasks, updatePriorities, addTaskGroup, addTaskSubGroup, updateTaskGroupName, updateTaskSubGroupName, updateDragHandlerData } from '../redux/actions'
import { getMountData, addTaskBackend, removeTaskBackend, updatePrioritiesBackend, updateTaskBackend, updateDateTimeBackend, addTaskGroupBackend, addTaskSubGroupBackend, editTaskGroupNameBackend, editTaskSubGroupNameBackend } from '../backendRequests'
import StatusPopOverChip from './StatusPopOverChip';

import notStarted from "../assets/icons/Not started.svg"
import inDevelopment from "../assets/icons/In development.svg"
import completed from "../assets/icons/Completed.svg"
import qaTesting from "../assets/icons/qa testing.svg"
import testFailed from "../assets/icons/test failed.svg"
import bugFixing from "../assets/icons/bug fixing.svg"
import readyToDeploy from "../assets/icons/ready to deploy.svg"
import deployedToDemo from "../assets/icons/demo.svg"
import deployedToLive from "../assets/icons/live.svg"

import { v4 as uuidv4 } from 'uuid';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
        backgroundColor: 'black'
    },
});

export default function TasksTable(props) {
    const [contextMenuAnchor, setContextMenuAnchor] = useState(null)
    const [tableRowsData, setTableRowsData] = useState([])
    const [taskModal, setTaskModal] = useState(null)

    const [filterGroupIds, setFilterGroupIds] = useState([])
    const [filterSubGroupIds, setFilterSubGroupIds] = useState([])
    const [filterStatusIds, setFilterStatusIds] = useState([])
    const [filterMainDevIds, setMainFilterDevIds] = useState([])
    const [filterCollDevIds, setCollFilterDevIds] = useState([])
    const [filterShowOnHolds, setFilterShowOnHolds] = useState(true);
    const [filterShowOnlyComplete, setFilterShowOnlyComplete] = useState(false);
    const [filterShowOnlyIncomplete, setFilterShowOnlyIncomplete] = useState(false);

    const [readOnlyMode, setReadOnlyMode] = useState(true);
    const [managementMode, setManagementMode] = useState(false);
    const [showBranchesInfo, setShowBranchesInfo] = useState(false);
    const [showDatesInfo, setShowDatesInfo] = useState(false);

    const [groupUpdatingData, setGroupUpdatingData] = useState(null); // { taskId: xxx, mode:0 } if  sub - change group 

    const dispatch = useDispatch();
    const devs = useSelector((state) => state.dashboardReducer.devs)
    const tasksData = useSelector((state) => state.dashboardReducer.tasksData)
    const taskGroups = useSelector((state) => state.dashboardReducer.taskGroups)
    const taskSubGroups = useSelector((state) => state.dashboardReducer.taskSubGroups)

    useEffect(() => {
        document.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });

        document.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "Alt":
                    event.preventDefault();
                    document.pressedKeys.alt = true

                    if (activeModeIsOn()) {
                        // debugger // for some reason dragHandlerData at this moment is null. Sasha to do
                        //  renewActiveDragRows()
                    }
                    break;

                case "Shift":
                    document.pressedKeys.shift = true
                    break;

                case "Control":
                    document.pressedKeys.ctrl = true
                    break;
                default:
                    break;
            }
        });

        document.addEventListener("keyup", (event) => {
            switch (event.key) {
                case "Alt":
                    event.preventDefault();
                    document.pressedKeys.alt = false

                    //if (activeModeIsOn()) renewActiveDragRows() // for some reason dragHandlerData at this moment is null. Sasha to do
                    break;

                case "Shift":
                    document.pressedKeys.shift = false
                    break;

                case "Control":
                    document.pressedKeys.ctrl = false
                    break;
                default:
                    break;
            }
        });

        document.pressedKeys = { shift: false, ctrl: false, alt: false }

        getMountData().then(data => {
            console.log('mount data:', data)
            dispatch(setMountData(data))
        })

    }, [])

    useEffect(() => {
        console.log('tableData refreshed tasksData:', tasksData, '     getTableRowsData(tasksData):', getTableRowsData(tasksData))
        filterTableData()
    }, [tasksData])

    useEffect(() => {
        filterTableData()
    }, [filterGroupIds, filterSubGroupIds, filterStatusIds, filterMainDevIds, filterCollDevIds, filterShowOnHolds, managementMode, filterShowOnlyComplete, filterShowOnlyIncomplete])

    const filterTableData = () => {
        let newTableData = tasksData

        if (managementMode) {
            if (filterShowOnlyComplete) //only complete filter
                newTableData = newTableData.filter(task => task.status === 8)
            else if (filterShowOnlyIncomplete) //only incomplete filter
                newTableData = newTableData.filter(task => task.status !== 8)
        } else {
            if (filterGroupIds.length > 0) //groups filter
                newTableData = newTableData.filter(task => filterGroupIds.includes(task.taskGroupId))

            if (filterSubGroupIds.length > 0) //sub groups filter
                newTableData = newTableData.filter(task => filterSubGroupIds.includes(task.taskSubGroupId))

            if (filterStatusIds.length > 0) //statuses filter
                newTableData = newTableData.filter(task => filterStatusIds.includes(task.status))

            if (filterMainDevIds.length > 0) //mainDev filter
                newTableData = newTableData.filter(task => filterMainDevIds.includes(task.mainDevId))

            if (filterCollDevIds.length > 0) //collaborator dev filter
                newTableData = newTableData.filter(task => task.collaboratorsIds.some(collDevId => filterCollDevIds.includes(collDevId)))

            if (!filterShowOnHolds) //on holds filter
                newTableData = newTableData.filter(task => !task.tags.includes('onHold'))
        }

        setTableRowsData(getTableRowsData(newTableData))
    }

    const setDragHandlerData = data => {
        if (!activeModeIsOn() && data !== props.dragHandlerData)
            dispatch(updateDragHandlerData(data))
    }

    const classes = useStyles();

    const openTaskInfo = task => {
        setTaskModal(task)
    }

    const activeModeIsOn = () => document.getElementsByClassName('active-drag-mode').length !== 0

    const handleBranchesInfoChange = e => setShowBranchesInfo(!showBranchesInfo)
    const handleDatesInfoChange = e => setShowDatesInfo(!showDatesInfo)
    const handleReadOnlyModeChange = e => setReadOnlyMode(!readOnlyMode)
    const handleFilterShowOnHoldsChange = e => setFilterShowOnHolds(!filterShowOnHolds)
    const handleShowOnlyCompleteChange = e => {
        const nextFilterStatus = !filterShowOnlyComplete
        setFilterShowOnlyComplete(nextFilterStatus)
        if (nextFilterStatus) setFilterShowOnlyIncomplete(false)
    }
    const handleShowOnlyIncompleteChange = e => {
        const nextFilterStatus = !filterShowOnlyIncomplete
        setFilterShowOnlyIncomplete(nextFilterStatus)
        if (nextFilterStatus) setFilterShowOnlyComplete(false)
    }

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

    const handleOnClickManagementMode = e => {
        const nextModeStatus = !managementMode
        setManagementMode(nextModeStatus)
        if (!nextModeStatus) {
            setFilterShowOnlyIncomplete(false)
            setFilterShowOnlyComplete(false)
        }
    }

    const noManagementFiltrationIsOn = () => !filterShowOnlyComplete && !filterShowOnlyIncomplete

    const addRow = (taskId, addBelow, copyTaskGroup, copyTaskSubGroup) => {
        const sourceTask = tasksData.find(task => task.id === taskId)
        const newPriorityForDeveloper = addBelow ? sourceTask.priorityForDeveloper + 1 : sourceTask.priorityForDeveloper
        const newTaskGroup = copyTaskGroup ? sourceTask.taskGroupId : null
        const newTaskSubGroup = copyTaskSubGroup ? sourceTask.taskSubGroupId : null

        const newTask = getEmptyTask(generateGuid(), sourceTask.mainDevId, newPriorityForDeveloper, newTaskGroup, newTaskSubGroup)

        const prioritiesShiftData = tasksData.filter(task => task.mainDevId === sourceTask.mainDevId && task.priorityForDeveloper >= newPriorityForDeveloper).map(task => { return { taskId: task.id, newPriorityIndex: ++task.priorityForDeveloper } })

        dispatch(addTask(newTask, prioritiesShiftData))
        addTaskBackend(newTask)
        updatePrioritiesBackend(prioritiesShiftData)
    }

    const removeRow = removingTaskId => {
        const removingTask = tasksData.find(task => task.id === removingTaskId)

        const prioritiesShiftData = tasksData.filter(task => task.mainDevId === removingTask.mainDevId && task.priorityForDeveloper > removingTask.priorityForDeveloper).map(task => { return { taskId: task.id, newPriorityIndex: --task.priorityForDeveloper } })

        dispatch(removeTask(removingTaskId, prioritiesShiftData))
        removeTaskBackend(removingTaskId)
        updatePrioritiesBackend(prioritiesShiftData)
    }

    const handleUpdateTaskNameAndInfo = updatingTask => {
        dispatch(updateTasks([updatingTask]))
        updateTaskBackend(updatingTask)
    }

    const handleOnHoldAction = (updatingTaskId, removeFromHold) => {
        let updatingTask = tasksData.find(task => task.id === updatingTaskId)

        if (removeFromHold)
            updatingTask.tags = updatingTask.tags.filter(tag => tag !== 'onHold')
        else
            updatingTask.tags.push('onHold')

        dispatch(updateTasks([updatingTask]))
        updateTaskBackend(updatingTask)
    }

    const handleOnCreateNewGroupAction = (updatingTaskId) => {
        setGroupUpdatingData({ taskId: updatingTaskId, mode: 0 })
        const newTaskGroupId = uuidv4()

        let updatingTask = tasksData.find(task => task.id === updatingTaskId)
        updatingTask.taskGroupId = newTaskGroupId

        dispatch(updateTasks([updatingTask]))
        addTaskGroupBackend(newTaskGroupId)

        dispatch(addTaskGroup(newTaskGroupId))
        updateTaskBackend(updatingTask)
    }

    const handleOnCreateNewSubGroupAction = (updatingTaskId) => {
        setGroupUpdatingData({ taskId: updatingTaskId, mode: 1 })
        const newTaskSubGroupId = uuidv4()

        let updatingTask = tasksData.find(task => task.id === updatingTaskId)
        updatingTask.taskSubGroupId = newTaskSubGroupId

        dispatch(updateTasks([updatingTask]))
        addTaskSubGroupBackend(newTaskSubGroupId, updatingTask.taskGroupId)

        dispatch(addTaskSubGroup(newTaskSubGroupId, updatingTask.taskGroupId))
        updateTaskBackend(updatingTask)
    }

    const handleOnRenameGroupAction = renamingGroupTaskId => {
        setGroupUpdatingData({ taskId: renamingGroupTaskId, mode: 0 })
    }

    const handleOnRenameSubGroupAction = renamingSubGroupTaskId => {
        setGroupUpdatingData({ taskId: renamingSubGroupTaskId, mode: 1 })
    }

    const SortableCont = SortableContainer(({ children }) => {
        return <tbody>{children}</tbody>;
    });

    const dragHelperContainer = () => {
        let taskProps = { task: props.dragHandlerData.task }
        let aaa = SortableTableRowElement(taskProps)

        return <div>SASHA</div>
    }

    const onSortStart = ({ node, index, collection, isKeySorting }) => {
        document.onSortOverData = { currentIndex: index }
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

    const onSortOver = ({ index, oldIndex, newIndex, collection, isKeySorting }, e) => {

        document.onSortOverData = { previousIndex: index, currentIndex: newIndex }
        renewActiveDragRows()
    }

    const onSortMove = () => {
        renewActiveDragRows()
    }

    const onSortEnd = ({ oldIndex: oldRowIndex, newIndex: newRowIndex }) => {
        const oldTableRowsData = tableRowsData
        const oldPriorities = tasksData.map(task => { return { taskId: task.id, newPriorityIndex: task.priorityForDeveloper } })
        const dragAffectedTasks = getDragAffectedRowIndexes().map(index => oldTableRowsData[index])

        let originalIndexOfReplacingRow
        let newMainDevId
        let newFirstTaskPriority
        let rowsToUpdate = []
        let taskToCopyFields

        if (oldRowIndex < newRowIndex) {
            originalIndexOfReplacingRow = newRowIndex + 1
        } else
            originalIndexOfReplacingRow = newRowIndex

        if (originalIndexOfReplacingRow === oldTableRowsData.length) { // case when we insert at the very bottom of table
            if (oldTableRowsData[originalIndexOfReplacingRow - 1].isBorder) {
                newMainDevId = oldTableRowsData[originalIndexOfReplacingRow - 1].nextDev.id
                newFirstTaskPriority = 0
                taskToCopyFields = null

            } else {
                newMainDevId = oldTableRowsData[originalIndexOfReplacingRow - 1].mainDevId
                newFirstTaskPriority = oldTableRowsData[originalIndexOfReplacingRow - 1].priorityForDeveloper + 1
                taskToCopyFields = oldTableRowsData[originalIndexOfReplacingRow - 1]
            }

        } else if (oldTableRowsData[originalIndexOfReplacingRow].isBorder) { // case when we replaced the border
            newMainDevId = oldTableRowsData[originalIndexOfReplacingRow].prevDev.id

            let currentEntryPoint = oldTableRowsData.filter(task => task.mainDevId === newMainDevId).length
            const notAffectedTasksBeforeEntryPoint = oldTableRowsData.filter(task => task.mainDevId === newMainDevId && task.priorityForDeveloper <= currentEntryPoint) //finish

            newFirstTaskPriority = notAffectedTasksBeforeEntryPoint.length

            if (originalIndexOfReplacingRow === 0 || oldTableRowsData[originalIndexOfReplacingRow - 1].isBorder) {
                taskToCopyFields = null
            } else {
                taskToCopyFields = oldTableRowsData[originalIndexOfReplacingRow - 1]
            }

        } else { // case when we replaced a regular task
            newMainDevId = oldTableRowsData[originalIndexOfReplacingRow].mainDevId

            const currentEntryPoint = oldTableRowsData[originalIndexOfReplacingRow].priorityForDeveloper
            const affectedTasksBeforeEntryPoint = dragAffectedTasks.filter(task => task.mainDevId === newMainDevId && task.priorityForDeveloper <= currentEntryPoint).length

            newFirstTaskPriority = currentEntryPoint - affectedTasksBeforeEntryPoint

            if (originalIndexOfReplacingRow !== 0 && !oldTableRowsData[originalIndexOfReplacingRow - 1].isBorder) {
                taskToCopyFields = oldTableRowsData[originalIndexOfReplacingRow - 1]
            } else {
                taskToCopyFields = oldTableRowsData[originalIndexOfReplacingRow]
            }
        }

        const isNotAllDevTasksToTheSameDev = !(props.dragHandlerData.mode == 0 && newMainDevId === dragAffectedTasks[0].mainDevId) // we eliminate attemptions to assign [All dev tasks] to the same developer

        if (oldRowIndex !== newRowIndex && isNotAllDevTasksToTheSameDev) {

            dragAffectedTasks.forEach((task, i) => {
                let taskFieldsUpdated = false

                if (newMainDevId !== task.mainDevId) {
                    task.mainDevId = newMainDevId
                    task.collaboratorsIds = task.collaboratorsIds.filter(collaboratorId => collaboratorId !== newMainDevId)

                    taskFieldsUpdated = true
                }

                if (taskToCopyFields && document.pressedKeys.ctrl) {
                    switch (props.dragHandlerData.mode) {
                        case 1: //group dragging
                            task.taskGroupId = taskToCopyFields.taskGroupId
                            break;
                        case 2: //sub group dragging
                            task.taskGroupId = taskToCopyFields.taskGroupId
                            task.taskSubGroupId = taskToCopyFields.taskSubGroupId
                            break;
                        case 3: //single task dragging
                            task.taskGroupId = taskToCopyFields.taskGroupId
                            task.taskSubGroupId = taskToCopyFields.taskSubGroupId
                            break;
                        default:
                            break
                    }
                    taskFieldsUpdated = true
                }


                if (taskFieldsUpdated) rowsToUpdate.push(task)

                task.priorityForDeveloper = i + newFirstTaskPriority
            })

            // priorities management

            let affectedTaskIds = dragAffectedTasks.map(task => task.id)
            let notAffectedTasks = tasksData.filter(row => !affectedTaskIds.includes(row.id))

            devs.forEach(dev => {
                let thisDevTasks = notAffectedTasks.filter(task => task.mainDevId === dev.id).sort((task1, task2) => task1.priorityForDeveloper - task2.priorityForDeveloper)
                thisDevTasks.forEach((task, i) => {
                    if (dev.id === newMainDevId && i >= newFirstTaskPriority) {
                        task.priorityForDeveloper = i + dragAffectedTasks.length
                    } else {
                        task.priorityForDeveloper = i
                    }
                })
            });

            const newPriorities = [...notAffectedTasks, ...dragAffectedTasks].map(task => { return { taskId: task.id, newPriorityIndex: task.priorityForDeveloper } })
            const updatedPriorities = newPriorities.filter(newPriority => {
                const oldCorrespondantPriority = oldPriorities.find(oldPriority => oldPriority.taskId === newPriority.taskId)

                return newPriority.newPriorityIndex !== oldCorrespondantPriority.newPriorityIndex
            })

            //debugger

            dispatch(updatePriorities(updatedPriorities))
            updatePrioritiesBackend(updatedPriorities)

            if (rowsToUpdate.length > 0) {
                dispatch(updateTasks(rowsToUpdate))
                rowsToUpdate.forEach(updatingTask => updateTaskBackend(updatingTask))
            }

        } else {
            getTableDOM().classList.remove("active-drag-mode")
            getCurrentRowsDOM().forEach(row => row.classList.remove('active-drag-mode-row'))
        }

        document.onSortOverData.currentIndex = null
    }

    const renewActiveDragRows = () => {
        getCurrentRowsDOM().forEach(row => row.classList.remove('active-drag-mode-row'))

        let dragAffectedRowIndexes = getDragAffectedRowIndexes()

        getCurrentRowsDOM().forEach((row, index) => {
            if (dragAffectedRowIndexes.includes(index)) row.classList.add("active-drag-mode-row")
        })
    }

    const getDragAffectedRowIndexes = () => {
        const tableRowsDataSource = tableRowsData

        const mainDevIsSame = row => row.mainDevId === props.dragHandlerData.task.mainDevId
        const taskGroupIsSame = row => row.taskGroupId === props.dragHandlerData.task.taskGroupId
        const taskSubGroupIsSame = row => row.taskSubGroupId === props.dragHandlerData.task.taskSubGroupId
        const taskIsSelected = row => row.id === props.dragHandlerData.task.id

        const shiftFiltrationPassed = row => {
            if (!document.pressedKeys.shift) {
                const currentOverRow = tableRowsData[document.onSortOverData.currentIndex]
                const draggingTaskDevId = props.dragHandlerData.task.mainDevId
                let destinationDevId

                if (currentOverRow.isBorder) {
                    if (document.onSortOverData.previousIndex < document.onSortOverData.currentIndex) {
                        destinationDevId = currentOverRow.nextDev.id
                    } else {
                        destinationDevId = currentOverRow.prevDev.id
                    }
                } else {
                    destinationDevId = currentOverRow.mainDevId
                }

                if (row.mainDevId === destinationDevId || row.mainDevId === draggingTaskDevId) {
                    return true
                }
                else {
                    return false
                }
            }
            else {
                return true
            }
        }

        switch (props.dragHandlerData.mode) {
            case 0:
                return tableRowsDataSource.map((row, i) => !row.isBorder && mainDevIsSame(row) ? i : null).filter(index => index !== null) //with out !== null it ignores [0]

            case 1:
                return tableRowsDataSource.map((row, i) => !row.isBorder && taskGroupIsSame(row) && shiftFiltrationPassed(row) ? i : null).filter(index => index !== null) //with out !== null it ignores [0]

            case 2:
                return tableRowsDataSource.map((row, i) => !row.isBorder && taskSubGroupIsSame(row) && shiftFiltrationPassed(row) ? i : null).filter(index => index !== null) //with out !== null it ignores [0]

            case 3:
                return tableRowsDataSource.map((row, i) => !row.isBorder && taskIsSelected(row) ? i : null).filter(index => index !== null) //with out !== null it ignores [0]

            default:
                break
        }
    }

    const getMainActiveRowDOM = () => document.getElementsByClassName('active-drag-mode-row-main')[0]
    const getTableDOM = () => document.getElementById('tasks-table')
    const getCurrentRowsDOM = () => Array.from(getTableDOM().children[1].children)

    const getTableRowsData = (tasksData) => {
        let newTableRowsData = []

        devs.forEach((dev, index) => {
            const devTasks = tasksData.filter(task => task.mainDevId === dev.id).sort((task1, task2) => task1.priorityForDeveloper - task2.priorityForDeveloper)

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

    const onMouseMoveDragHandler = (task, mode) => setDragHandlerData({ task: task, mode: mode })

    const SortableTableRow = SortableElement(props => props.isBorder ? <SortableTableBorderRowElement {...props} /> : <SortableTableRowElement {...props} />);

    const RowHandler = SortableHandle(props => <DragIndicatorIcon
        onMouseMove={e => onMouseMoveDragHandler(props.task, props.mode)} style={{ cursor: 'grab' }} />);

    const SortableTableRowElement = props => {

        const handleSaveDevs = (newCollaboratorIds, updatingTaskId) => {
            let updatingTask = tasksData.find(task => task.id === updatingTaskId)
            updatingTask.collaboratorsIds = newCollaboratorIds

            dispatch(updateTasks([updatingTask]))
            updateTaskBackend(updatingTask)
        }

        const handleActionButtonClick = (updatingTaskId, nextStatus) => {
            let updatingTask = tasksData.find(task => task.id === updatingTaskId)
            updatingTask.status = nextStatus

            updateTaskBackend(updatingTask) // we do it before date time updates because date times will be updated in a separate backend call

            let dateTypeIndex

            switch (nextStatus) {
                case 1:
                    updatingTask.started = Date.now()
                    dateTypeIndex = 1
                    break;
                case 2:
                    updatingTask.finished = Date.now()
                    dateTypeIndex = 2
                    break;
                case 4:
                    updatingTask.tested = Date.now()
                    dateTypeIndex = 3
                    break;
                case 5:
                    updatingTask.tested = Date.now()
                    dateTypeIndex = 3
                    break;
                case 6:
                    updatingTask.deployed = Date.now()
                    dateTypeIndex = 4
                    break;

                default:
                    break
            }
            updateDateTimeBackend(updatingTask.id, Math.floor(Date.now() / 1000), dateTypeIndex)
            dispatch(updateTasks([updatingTask]))
        }

        const handleOnChangeTaskSubGroup = (taskId, newSubGroupId) => {
            let updatingTask = tasksData.find(task => task.id === taskId)
            updatingTask.taskSubGroupId = newSubGroupId

            dispatch(updateTasks([updatingTask]))
            updateTaskBackend(updatingTask)
        }

        const handleOnChangeTaskGroup = (taskId, newGroupId) => {
            let updateTask = tasksData.find(task => task.id === taskId)
            updateTask.taskGroupId = newGroupId

            dispatch(updateTasks([updateTask]))
            updateTaskBackend(updateTask)
        }

        const handleOnBlurTaskGroupName = (newTaskGroupName, taskGroupId) => {
            dispatch(updateTaskGroupName(newTaskGroupName, taskGroupId))
            setGroupUpdatingData(null)
            editTaskGroupNameBackend(newTaskGroupName, taskGroupId)
        }

        const handleOnBlurTaskSubGroupName = (newTaskSubGroupName, taskSubGroupId) => {
            dispatch(updateTaskSubGroupName(newTaskSubGroupName, taskSubGroupId))
            setGroupUpdatingData(null)
            editTaskSubGroupNameBackend(newTaskSubGroupName, taskSubGroupId)
        }

        const renderActionButtons = () => {
            const actions = statuses.find(status => status.id === props.task.status).actions

            return <ButtonGroup className='actions-button-group' variant="contained" size="small">
                {actions.map(action => {
                    return <Button
                        onClick={e => handleActionButtonClick(props.task.id, action.nextStatus)}
                        color={action.statusName === 'Fail' ? 'secondary' : "primary"}
                        className={action.statusName === 'Pass' ? 'green-button' : undefined}>
                        {action.actionName}
                    </Button>
                })}
            </ButtonGroup>
        }

        const renderLastActionDateCell = () => {
            const lastActionDate = props.task.deployed ?? props.task.tested ?? props.task.finished ?? props.task.started ?? props.task.created

            return lastActionDate && <DateTimePicker date={lastActionDate} readOnly={true} />

        }

        const renderTaskSubGroupCell = () => {
            if (groupUpdatingData && groupUpdatingData.taskId === props.task.id && groupUpdatingData.mode === 1) {
                return <div>
                    <TextField
                        defaultValue={taskSubGroups.find(group => group.id === props.task.taskSubGroupId).name}
                        onBlur={e => handleOnBlurTaskSubGroupName(e.target.value, props.task.taskSubGroupId)} />
                </div>
            } else {
                if (readOnlyMode) {
                    if (props.task.taskSubGroupId)
                        return <div>
                            {managementMode && noManagementFiltrationIsOn() && <RowHandler task={props.task} mode={2} />}
                            {taskSubGroups.find(group => group.id === props.task.taskSubGroupId).name}
                        </div>

                } else {
                    return <div>
                        {props.task.taskSubGroupId ?
                            (managementMode && noManagementFiltrationIsOn() && <RowHandler task={props.task} mode={2} />) :
                            <DragIndicatorIcon style={{ color: 'transparent' }} />}
                        <TaskGroupSelect
                            currentGroupId={props.task.taskSubGroupId}
                            taskId={props.task.id}
                            taskGroups={taskSubGroups}
                            handleOnChangeTaskGroup={handleOnChangeTaskSubGroup} />
                    </div>
                }
            }

            return (<div>
                {props.task.taskSubGroupId &&
                    <>
                        <RowHandler task={props.task} mode={2} />
                        {taskSubGroups.find(group => group.id === props.task.taskSubGroupId).name}
                    </>}
            </div>)
        }

        const renderTaskGroupCell = () => {
            if (groupUpdatingData && groupUpdatingData.taskId === props.task.id && groupUpdatingData.mode === 0) {
                return <div>
                    <TextField
                        defaultValue={taskGroups.find(group => group.id === props.task.taskGroupId).name}
                        onBlur={e => handleOnBlurTaskGroupName(e.target.value, props.task.taskGroupId)} />
                </div>
            } else if (readOnlyMode) {
                if (props.task.taskGroupId)
                    return <div>
                        {managementMode && noManagementFiltrationIsOn() && <RowHandler task={props.task} mode={1} />}
                        {taskGroups.find(group => group.id === props.task.taskGroupId).name}
                    </div>
            } else {
                return <div>
                    {props.task.taskGroupId ?
                        (managementMode && noManagementFiltrationIsOn() && <RowHandler task={props.task} mode={1} />) :
                        <DragIndicatorIcon style={{ color: 'transparent' }} />}
                    <TaskGroupSelect
                        currentGroupId={props.task.taskGroupId}
                        taskId={props.task.id}
                        taskGroups={taskGroups}
                        handleOnChangeTaskGroup={handleOnChangeTaskGroup} />
                </div>
            }
        }

        const handleMainDevSelected = (newMainDevId, updatingTaskId) => {
            let updatingTask = tasksData.find(task => task.id === updatingTaskId)
            const prioritiesShiftData = tasksData.filter(task => task.mainDevId === updatingTask.mainDevId && task.priorityForDeveloper > updatingTask.priorityForDeveloper).map(task => { return { taskId: task.id, newPriorityIndex: --task.priorityForDeveloper } })

            updatingTask.priorityForDeveloper = tasksData.filter(task => task.mainDevId === newMainDevId).length
            updatingTask.mainDevId = newMainDevId
            updatingTask.collaboratorsIds = updatingTask.collaboratorsIds.filter(devId => devId !== newMainDevId)


            dispatch(updateTasks([updatingTask]))
            dispatch(updatePriorities(prioritiesShiftData))
            updateTaskBackend(updatingTask)
            updatePrioritiesBackend(prioritiesShiftData)
        }

        const handleStatusSelected = (statusId, updatingTaskId) => {
            let updatingTask = tasksData.find(task => task.id === updatingTaskId);
            updatingTask.status = statusId;
            dispatch(updateTasks([updatingTask]));
            updateTaskBackend(updatingTask);
        }

        const handleOnBlurTaskName = (newTaskName, updatingTaskId) => {
            let updatingTask = tasksData.find(task => task.id === updatingTaskId)
            updatingTask.name = newTaskName

            dispatch(updateTasks([updatingTask]))
            updateTaskBackend(updatingTask)
        }

        const handleOnChangeDate = (taskId, newDate, dateTypeIndex) => {
            let updatingTask = tasksData.find(task => task.id === taskId)

            switch (dateTypeIndex) {
                case 0:
                    updatingTask.created = newDate
                    break;
                case 1:
                    updatingTask.started = newDate
                    break;
                case 2:
                    updatingTask.finished = newDate
                    break;
                case 3:
                    updatingTask.tested = newDate
                    break;
                case 4:
                    updatingTask.deployed = newDate
                    break;
                default:
                    break
            }

            updateDateTimeBackend(taskId, Math.floor(newDate / 1000), dateTypeIndex)
            dispatch(updateTasks([updatingTask]))
        }

        // console.log('SortableTableRowElement props:', props)
        return (
            <TableRow className={'task-row'} key={props.task.id} onContextMenu={e => { handleRowOnContextMenu(e, props.task.id, false, false) }}>
                <TableCell align='center' className='cell-dragger'>{managementMode && noManagementFiltrationIsOn() && <RowHandler task={props.task} mode={0} />}</TableCell>
                <TableCell align='center' className='cell-main-dev-name'>
                    <DevsPopOverChip
                        readOnly={readOnlyMode}
                        dev={devs.find(dev => dev.id === props.task.mainDevId)}
                        taskId={props.task.id}
                        handleDevSelected={handleMainDevSelected}
                        devsSource={devs.filter(dev => dev.id !== props.task.mainDevId)}
                    />
                </TableCell>
                <TableCell align='center' className='cell-priority'>
                    {props.task.tags.includes('onHold') ? <PauseCircleFilledIcon color='action' /> : props.task.priorityForDeveloper + 1}
                </TableCell>
                <TableCell
                    className='cell-task-group'
                    onContextMenu={e => { handleRowOnContextMenu(e, props.task.id, true, false) }}>
                    {renderTaskGroupCell()}
                </TableCell>
                <TableCell
                    className='cell-task-sub-group'
                    onContextMenu={e => { handleRowOnContextMenu(e, props.task.id, true, true) }}>
                    {renderTaskSubGroupCell()}
                </TableCell>
                <TableCell className='cell-task-name'>
                    <div>
                        {managementMode && noManagementFiltrationIsOn() && <RowHandler task={props.task} mode={3} />}
                        {readOnlyMode ?
                            props.task.name :
                            <TextField defaultValue={props.task.name} onBlur={e => { handleOnBlurTaskName(e.target.value, props.task.id) }} />}
                    </div>
                </TableCell>
                <TableCell align='center' className='cell-collaborators'>
                    <DevsChangingPopOver
                        readOnlyMode={readOnlyMode}
                        handleSaveDevs={handleSaveDevs}
                        taskId={props.task.id}
                        taskMainDevId={props.task.mainDevId}
                        taskCollaboratorIds={props.task.collaboratorsIds}
                        devs={devs}
                    />
                </TableCell>
                <TableCell align='center' className='cell-status'>
                    <StatusPopOverChip className="status-chip"
                        readOnlyMode={readOnlyMode}
                        statusSource={statuses}
                        handleStatusSelected={handleStatusSelected}
                        taskId={props.task.id}
                        statusId={props.task.status}
                    />

                </TableCell>
                <TableCell align='center' className='cell-action' >
                    {renderActionButtons()}
                </TableCell>
                {managementMode && <TableCell align='center' className='cell-last-action-date cell-date-picker' >
                    {renderLastActionDateCell()}
                </TableCell>}
                <TableCell align='center' className={'cell-task-info' + (showDatesInfo || showBranchesInfo ? ' group-edge' : '')}>
                    <Tooltip title={props.task.description} arrow interactive>
                        <IconButton onClick={() => { openTaskInfo(props.task) }}>
                            <ImportContactsIcon fontSize="medium" color='primary' />
                        </IconButton>
                    </Tooltip>
                </TableCell>
                {showDatesInfo && <>
                    <TableCell className={'cell-date-picker'} align='center' >
                        <DateTimePicker dateName={'Created'} date={props.task.created} readOnly={readOnlyMode} handleOnChangeDate={handleOnChangeDate} taskId={props.task.id} dateTypeIndex={0} />
                    </TableCell>
                    <TableCell className={'cell-date-picker'} align='center' >
                        <DateTimePicker dateName={'Started'} date={props.task.started} readOnly={readOnlyMode} handleOnChangeDate={handleOnChangeDate} taskId={props.task.id} dateTypeIndex={1} />
                    </TableCell>
                    <TableCell className={'cell-date-picker'} align='center' >
                        <DateTimePicker dateName={'Finished'} date={props.task.finished} readOnly={readOnlyMode} handleOnChangeDate={handleOnChangeDate} taskId={props.task.id} dateTypeIndex={2} />
                    </TableCell>
                    <TableCell className={'cell-date-picker'} align='center' >
                        <DateTimePicker dateName={'Tested'} date={props.task.tested} readOnly={readOnlyMode} handleOnChangeDate={handleOnChangeDate} taskId={props.task.id} dateTypeIndex={3} />
                    </TableCell>
                    <TableCell className={'cell-date-picker' + (showBranchesInfo ? ' group-edge' : '')} align='center' >
                        <DateTimePicker dateName={'Deployed'} date={props.task.deployed} readOnly={readOnlyMode} handleOnChangeDate={handleOnChangeDate} taskId={props.task.id} dateTypeIndex={4} />
                    </TableCell>
                </>}
                {showBranchesInfo && <>
                    <TableCell align='center' className='branch-info-cell highlighted-branches-cell'>{props.task.branchData && props.task.branchData.megalfa}</TableCell>
                    <TableCell align='center' className='branch-info-cell highlighted-branches-cell'>{props.task.branchData && props.task.branchData.megalfaHub}</TableCell>
                    <TableCell align='center' className='branch-info-cell highlighted-branches-cell'>{props.task.branchData && props.task.branchData.acomba}</TableCell>
                    <TableCell align='center' className='branch-info-cell highlighted-branches-cell group-edge'>{props.task.branchData && props.task.branchData.maService}</TableCell>
                    <TableCell align='center' className='branch-info-cell'>{props.task.branchData && props.task.branchData.identity}</TableCell>
                    <TableCell align='center' className='branch-info-cell'>{props.task.branchData && props.task.branchData.registry}</TableCell>
                    <TableCell align='center' className='branch-info-cell'>{props.task.branchData && props.task.branchData.manufacturing}</TableCell>
                    <TableCell align='center' className='branch-info-cell'>{props.task.branchData && props.task.branchData.shipping}</TableCell>
                    <TableCell align='center' className='branch-info-cell'>{props.task.branchData && props.task.branchData.crossRef}</TableCell>
                    <TableCell align='center' className='branch-info-cell'>{props.task.branchData && props.task.branchData.catalog}</TableCell>
                    <TableCell align='center' className='branch-info-cell'>{props.task.branchData && props.task.branchData.customer}</TableCell>
                    <TableCell align='center' className='branch-info-cell'>{props.task.branchData && props.task.branchData.ordering}</TableCell>
                    <TableCell align='center' className='branch-info-cell group-edge'>{props.task.branchData && props.task.branchData.scheduling}</TableCell>
                    <TableCell align='center' className='branch-info-cell highlighted-branches-cell'>{props.task.branchData && props.task.branchData.aooHub}</TableCell>
                    <TableCell align='center' className='branch-info-cell highlighted-branches-cell'>{props.task.branchData && props.task.branchData.aoo}</TableCell>
                </>}
            </TableRow >
        )
    };

    const SortableTableBorderRowElement = props => {
        let emptyCells = []
        const cellsCount = 10 + (managementMode ? 1 : 0) + (showDatesInfo ? 5 : 0) + (showBranchesInfo ? 15 : 0)

        for (let i = 0; i < cellsCount; i++) {
            emptyCells.push(<TableCell >
                {/* <div style={{ background: `linear-gradient(transparent 100%, ${(props.prevDev.color)}) 30%` }} />
                <div style={{ background: `linear-gradient(${(props.nextDev.color)},transparent)` }} /> */}
                <div style={{ backgroundColor: props.prevDev.associatedBackgroundColor, height: '10px' }} />
                <div style={{ backgroundColor: props.nextDev.associatedBackgroundColor, height: '10px' }} />
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
            return tableRowsData.map((row, rowIndex) => {
                return <SortableTableRow
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
            })
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
                    onSortOver={onSortOver}
                    onSortMove={onSortMove}
                    axis="y"
                    lockAxis="y"
                    useDragHandle
                    // helperContainer={dragHelperContainer}
                    helperClass='active-drag-mode-row-main active-drag-mode-row'
                >
                    <Table className={classes.table} size="small" id='tasks-table'>
                        <TableHead>
                            <TableRow className='black-row'>
                                <TableCell align='center' className='cell-dragger'>
                                    <div>
                                        <IconButton className='filtering-header-icon' onClick={handleReadOnlyModeChange}>
                                            <EditIcon fontSize="small" color={readOnlyMode ? 'disabled' : 'primary'} />
                                        </IconButton>
                                    </div>
                                </TableCell>
                                <TableCell align='center' className='cell-main-dev-name' >
                                    <IconButton className='filtering-header-icon' onClick={handleOnClickManagementMode}>
                                        <FreeBreakfastIcon fontSize="small" color={managementMode ? 'primary' : 'disabled'} />
                                    </IconButton>
                                    Main
                                    <DevsFilteringPopOverButton
                                        filterDevIds={filterMainDevIds}
                                        setFilterDevIds={setMainFilterDevIds}
                                        devs={devs}
                                        tasks={tasksData}
                                        hidden={managementMode} />
                                </TableCell>
                                <TableCell align='center' className='cell-priority'>
                                    <IconButton className='small-view-button' onClick={handleFilterShowOnHoldsChange}>
                                        <PauseCircleFilledIcon fontSize="small" color={filterShowOnHolds ? 'primary' : 'disabled'} />
                                    </IconButton>
                                </TableCell>
                                <TableCell align='center' className='cell-task-group'>
                                    Task Group
                                    <GroupFilteringPopOver
                                        filterGroupIds={filterGroupIds}
                                        setFilterGroupIds={setFilterGroupIds}
                                        tasksData={tasksData}
                                        taskGroups={taskGroups}
                                        hidden={managementMode} />
                                </TableCell>
                                <TableCell align='center' className='cell-task-sub-group'>
                                    Task Sub group
                                    <GroupFilteringPopOver
                                        filterGroupIds={filterSubGroupIds}
                                        setFilterGroupIds={setFilterSubGroupIds}
                                        tasksData={tasksData}
                                        taskGroups={taskSubGroups}
                                        subGroupMode
                                        hidden={managementMode} />
                                </TableCell>
                                <TableCell align='center' className='cell-task-name'>Task Name</TableCell>
                                <TableCell align='center' className='cell-collaborators' >
                                    Collaborators
                                    <DevsFilteringPopOverButton
                                        filterDevIds={filterCollDevIds}
                                        setFilterDevIds={setCollFilterDevIds}
                                        tasks={tasksData}
                                        devs={devs}
                                        shortForm
                                        hidden={managementMode} />
                                </TableCell>
                                <TableCell align='center' className='cell-status' >
                                    Status
                                    <StatusFilteringPopOver
                                        filterStatusIds={filterStatusIds}
                                        setFilterStatusIds={setFilterStatusIds}
                                        tasksData={tasksData}
                                        statuses={statuses}
                                        hidden={managementMode} />
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
                                {managementMode && <TableCell align='center' className='cell-last-action-date' >
                                    <IconButton className='small-view-button' onClick={handleShowOnlyCompleteChange}>
                                        <CheckCircleIcon fontSize="small" color={filterShowOnlyComplete ? 'primary' : 'disabled'} />
                                    </IconButton>
                                    <IconButton className='small-view-button' onClick={handleShowOnlyIncompleteChange}>
                                        <BuildIcon fontSize="small" color={filterShowOnlyIncomplete ? 'primary' : 'disabled'} />
                                    </IconButton>
                                </TableCell>}
                                <TableCell align='center' className='cell-task-info' >Info</TableCell>
                                {showDatesInfo &&
                                    <>
                                        <TableCell align='center' >Created</TableCell>
                                        <TableCell align='center' >Started</TableCell>
                                        <TableCell align='center' >Finished</TableCell>
                                        <TableCell align='center' >Tested</TableCell>
                                        <TableCell align='center' >Deployed</TableCell>
                                    </>}
                                {showBranchesInfo &&
                                    <>
                                        <TableCell align='center' className='branch-info-header-cell'>Megalfa</TableCell>
                                        <TableCell align='center' className='branch-info-header-cell'>MegalfaHub</TableCell>
                                        <TableCell align='center' className='branch-info-header-cell'>Acomba</TableCell>
                                        <TableCell align='center' className='branch-info-header-cell'>MAService</TableCell>
                                        <TableCell align='center' className='branch-info-header-cell'>Identity</TableCell>
                                        <TableCell align='center' className='branch-info-header-cell'>Registry</TableCell>
                                        <TableCell align='center' className='branch-info-header-cell'>Manufacturing</TableCell>
                                        <TableCell align='center' className='branch-info-header-cell'>Shipping</TableCell>
                                        <TableCell align='center' className='branch-info-header-cell'>CrossRef</TableCell>
                                        <TableCell align='center' className='branch-info-header-cell'>Catalog</TableCell>
                                        <TableCell align='center' className='branch-info-header-cell'>Customer</TableCell>
                                        <TableCell align='center' className='branch-info-header-cell'>Ordering</TableCell>
                                        <TableCell align='center' className='branch-info-header-cell'>Scheduling</TableCell>
                                        <TableCell align='center' className='branch-info-header-cell'>AOOHub</TableCell>
                                        <TableCell align='center' className='branch-info-header-cell'>AOO</TableCell>
                                    </>}
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
                    <div>Select views to show more data:</div>
                    <IconButton onClick={handleBranchesInfoChange} ><AccountTreeIcon color='primary' />Git section</IconButton>
                    <IconButton onClick={handleDatesInfoChange}><EventAvailableIcon color='primary' />Dates section</IconButton>
                </div>
            }
            {contextMenuAnchor && <TableContextMenu
                addRow={addRow}
                removeRow={removeRow}
                contextMenuAnchor={contextMenuAnchor}
                setContextMenuAnchor={setContextMenuAnchor}
                readOnlyMode={readOnlyMode}

                onHoldAction={handleOnHoldAction}
                handleOnCreateNewGroupAction={handleOnCreateNewGroupAction}
                handleOnCreateNewSubGroupAction={handleOnCreateNewSubGroupAction}
                handleOnRenameGroupAction={handleOnRenameGroupAction}
                handleOnRenameSubGroupAction={handleOnRenameSubGroupAction}
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

const statuses = [
    { statusName: 'Not yet started', id: 0, icon: notStarted, actions: [{ actionName: 'Start (code)', nextStatus: 1 }] },
    { statusName: 'In development', id: 1, icon: inDevelopment, actions: [{ actionName: 'Done (code)', nextStatus: 2 }] },
    { statusName: 'Completed by Dev', id: 2, icon: completed, actions: [{ actionName: 'Start (test)', nextStatus: 3 }] },
    { statusName: 'QA Testing', id: 3, icon: qaTesting, actions: [{ actionName: 'Pass', nextStatus: 6 }, { actionName: 'Fail', nextStatus: 4 }] },
    { statusName: 'Test Failed', id: 4, icon: testFailed, actions: [{ actionName: 'Start (code)', nextStatus: 1 }] },
    { statusName: 'Bug Fixing', id: 5, icon: bugFixing, actions: [{ actionName: 'Done (bugfix)', nextStatus: 3 }] },
    { statusName: 'Ready to deploy', id: 6, icon: readyToDeploy, actions: [{ actionName: 'Deploy to Demo', nextStatus: 7 }] },
    { statusName: 'Deployed To Demo', id: 7, icon: deployedToDemo, actions: [{ actionName: 'Deploy to Live', nextStatus: 8 }] },
    { statusName: 'Deployed To Live', id: 8, icon: deployedToLive, actions: [] },
]

function getEmptyTask(id, mainDevId, priorityForDeveloper, newTaskGroupId, newTaskSubGroupId) {
    return {
        id: id,
        name: '',
        description: '',
        notes: '',
        priorityForDeveloper: priorityForDeveloper,
        taskGroupId: newTaskGroupId,
        taskSubGroupId: newTaskSubGroupId,
        mainDevId: mainDevId,
        collaboratorsIds: [],
        status: 0,
        taskInfo: '',
        created: null,
        started: null,
        finished: null,
        tested: null,
        deployed: null,
        tags: [],
        deploymentData: null,
        branchDataId: null
    }
}

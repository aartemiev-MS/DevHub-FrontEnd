import React, { useEffect, useState } from "react";

import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Tooltip from "@material-ui/core/Tooltip";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import EditIcon from "@material-ui/icons/Edit";
import TextField from "@material-ui/core/TextField";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import AssignmentIcon from "@material-ui/icons/Assignment";
import SubjectIcon from "@material-ui/icons/Subject";
import Button from "@material-ui/core/Button";
import FilterListIcon from "@material-ui/icons/FilterList";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Chip from "@material-ui/core/Chip";
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled";
import FreeBreakfastIcon from "@material-ui/icons/FreeBreakfast";
import ImportContactsIcon from "@material-ui/icons/ImportContacts";
import CircularProgress from "@material-ui/core/CircularProgress";
import PeopleIcon from "@material-ui/icons/People";
import GroupWorkIcon from "@material-ui/icons/GroupWork";

import difference from "lodash/difference";

import DateTimePicker from "./DateTimePicker";
import DevsFilteringPopOverButton from "./DevsFilteringPopOverButton";
import DevsPopOverChip from "./DevsPopOverChip";
import StatusChip from "./StatusChip";
import TableContextMenu from "./TableContextMenu";
import TaskInfoModal from "./TaskInfoModal";
import DevsChangingPopOver from "./DevsChangingPopOver";
import StatusFilteringPopOver from "./StatusFilteringPopOver";
import GroupFilteringPopOver from "./GroupFilteringPopOver";
import StatusSelect from "./StatusSelect";
import TaskGroupSelect from "./TaskGroupSelect";
import BranchSelect from "./BranchSelect";

import { Scrollbars } from "react-custom-scrollbars";

import SelectFromLib from "react-select";

import { v4 as generateGuid } from "uuid";

import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { SortableHandle } from "react-sortable-hoc";

import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
    setMountData,
    addTask,
    removeTask,
    updateTasks,
    updatePriorities,
    addTaskGroup,
    addTaskSubGroup,
    updateTaskGroupName,
    updateTaskSubGroupName,
    updateDragHandlerData,
    addBranchDataSet,
    updateBranchDataSet,
} from "../redux/actions";
import {
    getMountData,
    addTaskBackend,
    removeTaskBackend,
    updatePrioritiesBackend,
    updateTaskBackend,
    updateDateTimeBackend,
    addTaskGroupBackend,
    addTaskSubGroupBackend,
    editTaskGroupNameBackend,
    editTaskSubGroupNameBackend,
    addBranchDataSetBackend,
    updateBranchDataSetBackend,
} from "../backendRequests";
import StatusPopOverChip from "./StatusPopOverChip";

import inDevelopment from "../assets/icons/In development.svg";
import deployedToLive from "../assets/icons/live.svg";
import inDevelopmentInactive from "../assets/icons/In development inactive.svg";
import deployedToLiveInactive from "../assets/icons/live inactive.svg";

import { v4 as uuidv4 } from "uuid";

import { statuses, dateNamesArray, microserviceNamesArray } from "../constants";
import { getEmptyTask, getBranchNameFromSetByIndex } from "../static";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
        backgroundColor: "black",
    },
});

export default function TasksTable(props) {
    const [contextMenuAnchor, setContextMenuAnchor] = useState(null);
    const [tableRowsData, setTableRowsData] = useState([]);
    const [taskModal, setTaskModal] = useState(null);

    const [filterGroupIds, setFilterGroupIds] = useState([]);
    const [filterSubGroupIds, setFilterSubGroupIds] = useState([]);
    const [filterStatusIds, setFilterStatusIds] = useState([]);
    const [filterMainDevIds, setMainFilterDevIds] = useState([]);
    const [filterCollDevIds, setCollFilterDevIds] = useState([]);
    const [filterShowOnHolds, setFilterShowOnHolds] = useState(true);
    const [filterShowOnlyComplete, setFilterShowOnlyComplete] = useState(false);
    const [filterShowOnlyIncomplete, setFilterShowOnlyIncomplete] =
        useState(false);

    const [readOnlyMode, setReadOnlyMode] = useState(true);
    const [managementMode, setManagementMode] = useState(false);
    const [allTasksViewMode, setAllTasksViewMode] = useState(false);
    const [showBranchesInfo, setShowBranchesInfo] = useState(false);
    const [showDatesInfo, setShowDatesInfo] = useState(false);
    const [showCollaborators, setShowCollaborators] = useState(true);

    const [groupUpdatingData, setGroupUpdatingData] = useState(null); // { taskId: xxx, mode:0 } if  sub - change group
    const [taskIdsActionButtonPressed, setTaskIdsActionButtonPressed] = useState([]);

    const dispatch = useDispatch();
    const devs = useSelector((state) => state.dashboardReducer.devs);
    const tasksData = useSelector((state) => state.dashboardReducer.tasksData);
    const taskGroups = useSelector((state) => state.dashboardReducer.taskGroups);
    const taskSubGroups = useSelector(
        (state) => state.dashboardReducer.taskSubGroups
    );
    const loggedUser = useSelector((state) => state.dashboardReducer.loggedUser);
    const solutionBranches = useSelector(
        (state) => state.dashboardReducer.solutionBranches
    );
    const branchDataSets = useSelector(
        (state) => state.dashboardReducer.branchDataSets
    );

    const developerMode = loggedUser && loggedUser.role === "0";
    const qaMode = loggedUser && loggedUser.role === "1";
    const adminMode = loggedUser && loggedUser.role === "2";

    const canEditDates = adminMode;

    useEffect(() => {
        document.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });

        document.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "Alt":
                    event.preventDefault();
                    document.pressedKeys.alt = true;

                    if (activeModeIsOn()) {
                        // debugger // for some reason dragHandlerData at this moment is null. Sasha to do
                        //  renewActiveDragRows()
                    }
                    break;

                case "Shift":
                    document.pressedKeys.shift = true;
                    break;

                case "Control":
                    document.pressedKeys.ctrl = true;
                    break;
                default:
                    break;
            }
        });

        document.addEventListener("keyup", (event) => {
            switch (event.key) {
                case "Alt":
                    event.preventDefault();
                    document.pressedKeys.alt = false;

                    //if (activeModeIsOn()) renewActiveDragRows() // for some reason dragHandlerData at this moment is null. Sasha to do
                    break;

                case "Shift":
                    document.pressedKeys.shift = false;
                    break;

                case "Control":
                    document.pressedKeys.ctrl = false;
                    break;
                default:
                    break;
            }
        });

        document.pressedKeys = { shift: false, ctrl: false, alt: false };

        getMountData().then((data) => {
            console.log("mount data:", data);
            dispatch(setMountData(data));
        });
    }, []);

    useEffect(() => {
        console.log("tableData refreshed tasksData:", tasksData, "     getTableRowsData(tasksData):", getTableRowsData(tasksData));
        filterTableData();
    }, [tasksData]);

    useEffect(() => {
        filterTableData();
    }, [
        filterGroupIds,
        filterSubGroupIds,
        filterStatusIds,
        filterMainDevIds,
        filterCollDevIds,
        filterShowOnHolds,
        managementMode,
        allTasksViewMode,
        filterShowOnlyComplete,
        filterShowOnlyIncomplete,
    ]);

    const filterTableData = () => {
        let newTableData = tasksData;

        if (managementMode) {
            if (filterShowOnlyComplete)
                //only complete filter
                newTableData = newTableData.filter((task) => task.status === 8);
            else if (filterShowOnlyIncomplete)
                //only incomplete filter
                newTableData = newTableData.filter((task) => task.status !== 8);
        } else {
            if (filterGroupIds.length > 0)
                //groups filter
                newTableData = newTableData.filter((task) =>
                    filterGroupIds.includes(task.taskGroupId)
                );

            if (filterSubGroupIds.length > 0)
                //sub groups filter
                newTableData = newTableData.filter((task) =>
                    filterSubGroupIds.includes(task.taskSubGroupId)
                );

            if (filterStatusIds.length > 0)
                //statuses filter
                newTableData = newTableData.filter((task) =>
                    filterStatusIds.includes(task.status)
                );

            if (filterMainDevIds.length > 0)
                //mainDev filter
                newTableData = newTableData.filter((task) =>
                    filterMainDevIds.includes(task.mainDevId)
                );

            if (filterCollDevIds.length > 0)
                //collaborator dev filter
                newTableData = newTableData.filter((task) =>
                    task.collaboratorsIds.some((collDevId) =>
                        filterCollDevIds.includes(collDevId)
                    )
                );

            if (!filterShowOnHolds)
                //on holds filter
                newTableData = newTableData.filter(
                    (task) => !task.tags.includes("onHold")
                );
        }

        setTableRowsData(getTableRowsData(newTableData));
    };

    const setDragHandlerData = (data) => {
        if (!activeModeIsOn() && data !== props.dragHandlerData)
            dispatch(updateDragHandlerData(data));
    };

    const classes = useStyles();

    const openTaskInfo = (task) => {
        setTaskModal(task);
    };

    const activeModeIsOn = () =>
        document.getElementsByClassName("active-drag-mode").length !== 0;

    const handleBranchesInfoChange = (e) =>
        setShowBranchesInfo(!showBranchesInfo);
    const handleDatesInfoChange = (e) => setShowDatesInfo(!showDatesInfo);
    const handleReadOnlyModeChange = (e) => setReadOnlyMode(!readOnlyMode);
    const handleFilterShowOnHoldsChange = (e) =>
        setFilterShowOnHolds(!filterShowOnHolds);
    const handleShowOnlyCompleteChange = (e) => {
        const nextFilterStatus = !filterShowOnlyComplete;
        setFilterShowOnlyComplete(nextFilterStatus);
        if (nextFilterStatus) setFilterShowOnlyIncomplete(false);
    };
    const handleShowOnlyIncompleteChange = (e) => {
        const nextFilterStatus = !filterShowOnlyIncomplete;
        setFilterShowOnlyIncomplete(nextFilterStatus);
        if (nextFilterStatus) setFilterShowOnlyComplete(false);
    };
    const handleShowCollaboratorsChange = (e) => {
        const nextFilterStatus = !showCollaborators;
        setShowCollaborators(nextFilterStatus);
    };

    const handleRowOnContextMenu = (
        e,
        taskId,
        copyTaskGroup,
        copyTaskSubGroup,
        copyTaskName,
        hasTaskGroup,
        hasTaskSubGroup
    ) => {
        e.stopPropagation();
        e.preventDefault();

        setContextMenuAnchor({
            xPos: e.clientX,
            yPos: e.clientY,
            taskId: taskId,
            isOnHold: getTaskById(taskId).tags.includes("onHold"),
            copyTaskGroup: copyTaskGroup,
            copyTaskSubGroup: copyTaskSubGroup,
            copyTaskName: copyTaskName,
            hasTaskGroup: hasTaskGroup,
            hasTaskSubGroup: hasTaskSubGroup,
        });
    };

    const handleOnClickManagementMode = (e) => {
        const nextModeStatus = !managementMode;
        setManagementMode(nextModeStatus);
        if (!nextModeStatus) {
            setFilterShowOnlyIncomplete(false);
            setFilterShowOnlyComplete(false);
        }
    };

    const handleOnClickAllTasksViewMode = (e) => {
        const nextModeStatus = !allTasksViewMode;
        setAllTasksViewMode(nextModeStatus);
    };

    const noManagementFiltrationIsOn = () =>
        !filterShowOnlyComplete && !filterShowOnlyIncomplete;

    const addRow = async (
        taskId,
        addBelow,
        copyTaskGroup,
        copyTaskSubGroup,
        copyTaskName
    ) => {
        const sourceTask = tasksData.find((task) => task.id === taskId);
        const newPriorityForDeveloper = addBelow
            ? sourceTask.priorityForDeveloper + 1
            : sourceTask.priorityForDeveloper;
        const newTaskGroup = copyTaskGroup ? sourceTask.taskGroupId : null;
        const newTaskSubGroup = copyTaskSubGroup ? sourceTask.taskSubGroupId : null;
        const newTaskName = copyTaskName ? sourceTask.name : "";

        const newTask = getEmptyTask(
            generateGuid(),
            sourceTask.mainDevId,
            newPriorityForDeveloper,
            newTaskGroup,
            newTaskSubGroup,
            newTaskName
        );

        const prioritiesShiftData = tasksData
            .filter(
                (task) =>
                    task.mainDevId === sourceTask.mainDevId &&
                    task.priorityForDeveloper >= newPriorityForDeveloper
            )
            .map((task) => {
                return {
                    taskId: task.id,
                    newPriorityIndex: ++task.priorityForDeveloper,
                };
            });

        var date = new Date(Date.now());
        date.toJSON(); // this is the JavaScript date as a c# DateTime
        newTask.created = date;

        addTaskBackend(newTask).then((success) => {
            if (success) {
                updatePrioritiesBackend(prioritiesShiftData);
                dispatch(addTask(newTask, prioritiesShiftData));
            }
        });
    };

    const removeRow = (removingTaskId) => {
        const removingTask = tasksData.find((task) => task.id === removingTaskId);

        const prioritiesShiftData = tasksData
            .filter(
                (task) =>
                    task.mainDevId === removingTask.mainDevId &&
                    task.priorityForDeveloper > removingTask.priorityForDeveloper
            )
            .map((task) => {
                return {
                    taskId: task.id,
                    newPriorityIndex: --task.priorityForDeveloper,
                };
            });

        dispatch(removeTask(removingTaskId, prioritiesShiftData));
        removeTaskBackend(removingTaskId);
        updatePrioritiesBackend(prioritiesShiftData);
    };

    const handleUpdateTaskNameAndInfo = (updatingTask) => {
        dispatch(updateTasks([updatingTask]));
        updateTaskBackend(updatingTask);
    };

    const handleOnHoldAction = (updatingTaskId, removeFromHold) => {
        let updatingTask = tasksData.find((task) => task.id === updatingTaskId);

        if (removeFromHold)
            updatingTask.tags = updatingTask.tags.filter((tag) => tag !== "onHold");
        else updatingTask.tags.push("onHold");

        dispatch(updateTasks([updatingTask]));
        updateTaskBackend(updatingTask);
    };

    const handleOnCreateNewGroupAction = (updatingTaskId) => {
        setGroupUpdatingData({ taskId: updatingTaskId, mode: 0 });
        const newTaskGroupId = uuidv4();

        let updatingTask = tasksData.find((task) => task.id === updatingTaskId);
        updatingTask.taskGroupId = newTaskGroupId;

        dispatch(updateTasks([updatingTask]));
        addTaskGroupBackend(newTaskGroupId);

        dispatch(addTaskGroup(newTaskGroupId));
        updateTaskBackend(updatingTask);

        setTimeout(() => {
            focusNameUpdatingField();
        }, 500);
    };

    const handleOnCreateNewSubGroupAction = (updatingTaskId) => {
        setGroupUpdatingData({ taskId: updatingTaskId, mode: 1 });
        const newTaskSubGroupId = uuidv4();

        let updatingTask = tasksData.find((task) => task.id === updatingTaskId);
        updatingTask.taskSubGroupId = newTaskSubGroupId;

        dispatch(updateTasks([updatingTask]));
        addTaskSubGroupBackend(newTaskSubGroupId, updatingTask.taskGroupId);

        dispatch(addTaskSubGroup(newTaskSubGroupId, updatingTask.taskGroupId));
        updateTaskBackend(updatingTask);

        setTimeout(() => {
            focusNameUpdatingField();
        }, 500);
    };

    const handleOnRenameGroupAction = (renamingGroupTaskId) => {
        setGroupUpdatingData({ taskId: renamingGroupTaskId, mode: 0 });

        setTimeout(() => {
            focusNameUpdatingField();
        }, 500);
    };

    const handleOnRenameSubGroupAction = (renamingSubGroupTaskId) => {
        setGroupUpdatingData({ taskId: renamingSubGroupTaskId, mode: 1 });

        setTimeout(() => {
            focusNameUpdatingField();
        }, 500);
    };

    const focusNameUpdatingField = () =>
        document.getElementById("group-name-updating-field").focus();

    const SortableCont = SortableContainer(({ children }) => {
        return <tbody>{children}</tbody>;
    });

    const renderLegend = () => {
        return <div className="big-view-buttons-wrap">
            <div>Select views to show more data:</div>
            <IconButton onClick={handleBranchesInfoChange}>
                <AccountTreeIcon color="primary" />
                Git section
            </IconButton>
            <IconButton onClick={handleDatesInfoChange}>
                <EventAvailableIcon color="primary" />
                Dates section
            </IconButton>
        </div>
    }

    const onSortStart = ({ node, index, collection, isKeySorting }) => {
        document.onSortOverData = { currentIndex: index };
        getTableDOM().classList.add("active-drag-mode");

        let dragAffectedRowIndexes = getDragAffectedRowIndexes();

        getCurrentRowsDOM().forEach((row, index) => {
            if (dragAffectedRowIndexes.includes(index))
                row.classList.add("active-drag-mode-row");
        });
    };

    const onSortOver = (
        { index, oldIndex, newIndex, collection, isKeySorting },
        e
    ) => {
        document.onSortOverData = { previousIndex: index, currentIndex: newIndex };
        renewActiveDragRows();
    };

    const onSortMove = () => {
        renewActiveDragRows();
    };

    const onSortEnd = ({ oldIndex: oldRowIndex, newIndex: newRowIndex }) => {
        const oldTableRowsData = tableRowsData;
        const oldPriorities = tasksData.map((task) => {
            return { taskId: task.id, newPriorityIndex: task.priorityForDeveloper };
        });
        const dragAffectedTasks = getDragAffectedRowIndexes().map(
            (index) => oldTableRowsData[index]
        );

        let originalIndexOfReplacingRow;
        let newMainDevId;
        let newFirstTaskPriority;
        let rowsToUpdate = [];
        let taskToCopyFields;

        if (oldRowIndex < newRowIndex) {
            originalIndexOfReplacingRow = newRowIndex + 1;
        } else originalIndexOfReplacingRow = newRowIndex;

        if (originalIndexOfReplacingRow === oldTableRowsData.length) {
            // case when we insert at the very bottom of table
            if (oldTableRowsData[originalIndexOfReplacingRow - 1].isBorder) {
                newMainDevId =
                    oldTableRowsData[originalIndexOfReplacingRow - 1].nextDev.id;
                newFirstTaskPriority = 0;
                taskToCopyFields = null;
            } else {
                newMainDevId =
                    oldTableRowsData[originalIndexOfReplacingRow - 1].mainDevId;
                newFirstTaskPriority =
                    oldTableRowsData[originalIndexOfReplacingRow - 1]
                        .priorityForDeveloper;
                taskToCopyFields = oldTableRowsData[originalIndexOfReplacingRow - 1];
            }
        } else if (oldTableRowsData[originalIndexOfReplacingRow].isBorder) {
            // case when we replaced the border
            newMainDevId = oldTableRowsData[originalIndexOfReplacingRow].prevDev.id;

            let currentEntryPoint = oldTableRowsData.filter(
                (task) => task.mainDevId === newMainDevId
            ).length;
            const notAffectedTasksBeforeEntryPoint = oldTableRowsData.filter(
                (task) =>
                    task.mainDevId === newMainDevId &&
                    task.priorityForDeveloper <= currentEntryPoint
            ); //finish

            newFirstTaskPriority = notAffectedTasksBeforeEntryPoint.length;

            if (
                originalIndexOfReplacingRow === 0 ||
                oldTableRowsData[originalIndexOfReplacingRow - 1].isBorder
            ) {
                taskToCopyFields = null;
            } else {
                taskToCopyFields = oldTableRowsData[originalIndexOfReplacingRow - 1];
            }
        } else {
            // case when we replaced a regular task
            newMainDevId = oldTableRowsData[originalIndexOfReplacingRow].mainDevId;

            const currentEntryPoint =
                oldTableRowsData[originalIndexOfReplacingRow].priorityForDeveloper;
            const affectedTasksBeforeEntryPoint = dragAffectedTasks.filter(
                (task) =>
                    task.mainDevId === newMainDevId &&
                    task.priorityForDeveloper <= currentEntryPoint
            ).length;

            newFirstTaskPriority = currentEntryPoint - affectedTasksBeforeEntryPoint;

            if (
                originalIndexOfReplacingRow !== 0 &&
                !oldTableRowsData[originalIndexOfReplacingRow - 1].isBorder
            ) {
                taskToCopyFields = oldTableRowsData[originalIndexOfReplacingRow - 1];
            } else {
                taskToCopyFields = oldTableRowsData[originalIndexOfReplacingRow];
            }
        }

        const isNotAllDevTasksToTheSameDev = !(
            props.dragHandlerData.mode == 0 &&
            newMainDevId === dragAffectedTasks[0].mainDevId
        ); // we eliminate attemptions to assign [All dev tasks] to the same developer

        if (oldRowIndex !== newRowIndex && isNotAllDevTasksToTheSameDev) {
            dragAffectedTasks.forEach((task, i) => {
                let taskFieldsUpdated = false;

                if (newMainDevId !== task.mainDevId) {
                    task.mainDevId = newMainDevId;
                    task.collaboratorsIds = task.collaboratorsIds.filter(
                        (collaboratorId) => collaboratorId !== newMainDevId
                    );

                    taskFieldsUpdated = true;
                }

                if (taskToCopyFields && document.pressedKeys.ctrl) {
                    switch (props.dragHandlerData.mode) {
                        case 1: //group dragging
                            task.taskGroupId = taskToCopyFields.taskGroupId;
                            break;
                        case 2: //sub group dragging
                            task.taskGroupId = taskToCopyFields.taskGroupId;
                            task.taskSubGroupId = taskToCopyFields.taskSubGroupId;
                            break;
                        case 3: //single task dragging
                            task.taskGroupId = taskToCopyFields.taskGroupId;
                            task.taskSubGroupId = taskToCopyFields.taskSubGroupId;
                            break;
                        default:
                            break;
                    }
                    taskFieldsUpdated = true;
                }

                if (taskFieldsUpdated) rowsToUpdate.push(task);

                task.priorityForDeveloper = i + newFirstTaskPriority;
            });

            // priorities management

            let affectedTaskIds = dragAffectedTasks.map((task) => task.id);
            let notAffectedTasks = tasksData.filter(
                (row) => !affectedTaskIds.includes(row.id)
            );

            devs.forEach((dev) => {
                let thisDevTasks = notAffectedTasks
                    .filter((task) => task.mainDevId === dev.id)
                    .sort(
                        (task1, task2) =>
                            task1.priorityForDeveloper - task2.priorityForDeveloper
                    );
                thisDevTasks.forEach((task, i) => {
                    if (dev.id === newMainDevId && i >= newFirstTaskPriority) {
                        task.priorityForDeveloper = i + dragAffectedTasks.length;
                    } else {
                        task.priorityForDeveloper = i;
                    }
                });
            });

            const newPriorities = [...notAffectedTasks, ...dragAffectedTasks].map(
                (task) => {
                    return {
                        taskId: task.id,
                        newPriorityIndex: task.priorityForDeveloper,
                    };
                }
            );
            const updatedPriorities = newPriorities.filter((newPriority) => {
                const oldCorrespondantPriority = oldPriorities.find(
                    (oldPriority) => oldPriority.taskId === newPriority.taskId
                );

                return (
                    newPriority.newPriorityIndex !==
                    oldCorrespondantPriority.newPriorityIndex
                );
            });

            dispatch(updatePriorities(updatedPriorities));
            updatePrioritiesBackend(updatedPriorities);

            if (rowsToUpdate.length > 0) {
                dispatch(updateTasks(rowsToUpdate));
                rowsToUpdate.forEach((updatingTask) => updateTaskBackend(updatingTask));
            }
        } else {
            getTableDOM().classList.remove("active-drag-mode");
            getCurrentRowsDOM().forEach((row) =>
                row.classList.remove("active-drag-mode-row")
            );
        }

        document.onSortOverData.currentIndex = null;
    };

    const renewActiveDragRows = () => {
        getCurrentRowsDOM().forEach((row) =>
            row.classList.remove("active-drag-mode-row")
        );

        let dragAffectedRowIndexes = getDragAffectedRowIndexes();

        getCurrentRowsDOM().forEach((row, index) => {
            if (dragAffectedRowIndexes.includes(index))
                row.classList.add("active-drag-mode-row");
        });
    };

    const getDragAffectedRowIndexes = () => {
        const tableRowsDataSource = tableRowsData;

        const mainDevIsSame = (row) =>
            row.mainDevId === props.dragHandlerData.task.mainDevId;
        const taskGroupIsSame = (row) =>
            row.taskGroupId === props.dragHandlerData.task.taskGroupId;
        const taskSubGroupIsSame = (row) =>
            row.taskSubGroupId === props.dragHandlerData.task.taskSubGroupId;
        const taskIsSelected = (row) => row.id === props.dragHandlerData.task.id;

        const shiftFiltrationPassed = (row) => {
            if (!document.pressedKeys.shift) {
                const currentOverRow =
                    tableRowsData[document.onSortOverData.currentIndex];
                const draggingTaskDevId = props.dragHandlerData.task.mainDevId;
                let destinationDevId;

                if (currentOverRow.isBorder) {
                    if (
                        document.onSortOverData.previousIndex <
                        document.onSortOverData.currentIndex
                    ) {
                        destinationDevId = currentOverRow.nextDev.id;
                    } else {
                        destinationDevId = currentOverRow.prevDev.id;
                    }
                } else {
                    destinationDevId = currentOverRow.mainDevId;
                }

                if (
                    row.mainDevId === destinationDevId ||
                    row.mainDevId === draggingTaskDevId
                ) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        };

        switch (props.dragHandlerData.mode) {
            case 0:
                return tableRowsDataSource
                    .map((row, i) => (!row.isBorder && mainDevIsSame(row) ? i : null))
                    .filter((index) => index !== null); //with out !== null it ignores [0]

            case 1:
                return tableRowsDataSource
                    .map((row, i) =>
                        !row.isBorder && taskGroupIsSame(row) && shiftFiltrationPassed(row)
                            ? i
                            : null
                    )
                    .filter((index) => index !== null); //with out !== null it ignores [0]

            case 2:
                return tableRowsDataSource
                    .map((row, i) =>
                        !row.isBorder &&
                            taskSubGroupIsSame(row) &&
                            shiftFiltrationPassed(row)
                            ? i
                            : null
                    )
                    .filter((index) => index !== null); //with out !== null it ignores [0]

            case 3:
                return tableRowsDataSource
                    .map((row, i) => (!row.isBorder && taskIsSelected(row) ? i : null))
                    .filter((index) => index !== null); //with out !== null it ignores [0]

            default:
                break;
        }
    };

    const getTableDOM = () => document.getElementById("tasks-table");
    const getCurrentRowsDOM = () =>
        Array.from(getTableDOM().children[1].children);

    const getTableRowsData = (allTasksData) => {
        let newTableRowsData = [];
        let tasksData = allTasksData;

        if (loggedUser && !allTasksViewMode && !adminMode) {
            tasksData = tasksData.filter(
                (task) =>
                    task.mainDevId === loggedUser.id ||
                    task.collaboratorsIds.includes(loggedUser.id)
            );
        }

        devs.forEach((dev, index) => {
            const devTasks = tasksData
                .filter((task) => task.mainDevId === dev.id)
                .sort(
                    (task1, task2) =>
                        task1.priorityForDeveloper - task2.priorityForDeveloper
                );

            devTasks.forEach((task) => newTableRowsData.push(task));

            if (adminMode && index !== devs.length - 1)
                newTableRowsData.push({
                    isBorder: true,
                    prevDev: dev,
                    nextDev: devs[index + 1],
                });
        });

        return newTableRowsData;
    };
    const getTaskById = (id) => tasksData.find((task) => task.id === id);

    const onMouseMoveDragHandler = (task, mode) =>
        setDragHandlerData({ task: task, mode: mode });

    const SortableTableRow = SortableElement((props) =>
        props.isBorder ? (
            <SortableTableBorderRowElement {...props} />
        ) : (
            <SortableTableRowElement {...props} />
        )
    );

    const RowHandler = SortableHandle((props) => (
        <DragIndicatorIcon
            onMouseMove={(e) => onMouseMoveDragHandler(props.task, props.mode)}
            style={{ cursor: "grab" }}
        />
    ));

    const SortableTableRowElement = (props) => {
        const handleSaveDevs = (newCollaboratorIds, updatingTaskId) => {
            let updatingTask = tasksData.find((task) => task.id === updatingTaskId);
            updatingTask.collaboratorsIds = newCollaboratorIds;

            dispatch(updateTasks([updatingTask]));
            updateTaskBackend(updatingTask);
        };

        const handleActionButtonClick = (updatingTaskId, nextStatus) => {
            let updatingTask = tasksData.find((task) => task.id === updatingTaskId);
            let updatingDateTypeIndex;

            updatingTask.status = nextStatus;

            switch (nextStatus) {
                case 1:
                    updatingDateTypeIndex = 1;
                    break;
                case 2:
                    updatingDateTypeIndex = 2;
                    break;
                case 4:
                    updatingDateTypeIndex = 3;
                    break;
                case 6:
                    updatingDateTypeIndex = 3;
                    break;
                case 10:
                    updatingDateTypeIndex = 4;
                    break;

                default:
                    break;
            }

            setTaskIdsActionButtonPressed([
                ...taskIdsActionButtonPressed,
                updatingTask.id,
            ]);
            if (updatingDateTypeIndex) {
                updateDateTimeBackend(
                    updatingTask.id,
                    Math.floor(Date.now() / 1000),
                    updatingDateTypeIndex,
                    nextStatus
                ).then(({ success, newReturnedDate }) => {
                    if (success) {
                        updateTaskDateByIndex(
                            updatingTask,
                            updatingDateTypeIndex,
                            newReturnedDate
                        );
                        dispatch(updateTasks([updatingTask]));
                        removeLoadingFromTask(updatingTask.id);
                    }
                });
            } else {
                updateTaskBackend(updatingTask).then((result) => {
                    if (result) {
                        dispatch(updateTasks([updatingTask]));
                        removeLoadingFromTask(updatingTask.id);
                    }
                });
            }
        };

        const removeLoadingFromTask = (removingTaskId) => {
            setTaskIdsActionButtonPressed(
                taskIdsActionButtonPressed.filter((taskId) => taskId !== removingTaskId)
            );
        };

        const handleOnChangeTaskSubGroup = (taskId, newSubGroupId) => {
            let updatingTask = tasksData.find((task) => task.id === taskId);
            updatingTask.taskSubGroupId = newSubGroupId;

            dispatch(updateTasks([updatingTask]));
            updateTaskBackend(updatingTask);
        };

        const handleOnChangeTaskGroup = (taskId, newGroupId) => {
            let updateTask = tasksData.find((task) => task.id === taskId);
            updateTask.taskGroupId = newGroupId;

            dispatch(updateTasks([updateTask]));
            updateTaskBackend(updateTask);
        };

        const handleOnBlurTaskGroupName = (newTaskGroupName, taskGroupId) => {
            dispatch(updateTaskGroupName(newTaskGroupName, taskGroupId));
            setGroupUpdatingData(null);
            editTaskGroupNameBackend(newTaskGroupName, taskGroupId);
        };

        const handleOnBlurTaskSubGroupName = (
            newTaskSubGroupName,
            taskSubGroupId
        ) => {
            dispatch(updateTaskSubGroupName(newTaskSubGroupName, taskSubGroupId));
            setGroupUpdatingData(null);
            editTaskSubGroupNameBackend(newTaskSubGroupName, taskSubGroupId);
        };

        const handleOnKeyDownEditableTextField = (e) => {
            if (e.code === "Enter") {
                e.preventDefault();
                e.target.blur();
            }
        };

        const renderActionButtons = () => {
            const actions = statuses.find(
                (status) => status.id === props.task.status
            ).actions;

            const hasTheRightToPerformActions =
                adminMode ||
                props.task.mainDevId === loggedUser.id ||
                props.task.collaboratorsIds.includes(loggedUser.id)


            return (
                !taskisLoading() &&
                hasTheRightToPerformActions && (
                    <ButtonGroup
                        className="actions-button-group"
                        variant="contained"
                        size="small"
                    >
                        {actions.map((action) => {
                            return (
                                <Button
                                    onClick={(e) =>
                                        handleActionButtonClick(props.task.id, action.nextStatus)
                                    }
                                    color={action.statusName === "Fail" ? "secondary" : "primary"}
                                    className={
                                        action.statusName === "Pass" ? "green-button" : undefined
                                    }
                                >
                                    {action.actionName}
                                </Button>
                            );
                        })}
                    </ButtonGroup>
                )
            );
        };

        const taskisLoading = () =>
            taskIdsActionButtonPressed.some((taskId) => taskId === props.task.id);

        const renderLastActionDateCell = () => {
            const lastActionDate =
                props.task.deployed ??
                props.task.tested ??
                props.task.finished ??
                props.task.started ??
                props.task.created;

            return (
                lastActionDate && (
                    <DateTimePicker date={lastActionDate} readOnly={true} />
                )
            );
        };

        const renderTaskSubGroupCell = () => {
            if (
                groupUpdatingData &&
                groupUpdatingData.taskId === props.task.id &&
                groupUpdatingData.mode === 1
            ) {
                return (
                    <div>
                        {renderTransparentDragger()}
                        <TextField
                            id="group-name-updating-field"
                            defaultValue={
                                taskSubGroups.find(
                                    (group) => group.id === props.task.taskSubGroupId
                                ).name
                            }
                            onBlur={(e) =>
                                handleOnBlurTaskSubGroupName(
                                    e.target.value,
                                    props.task.taskSubGroupId
                                )
                            }
                            onKeyDown={handleOnKeyDownEditableTextField}
                        />
                    </div>
                );
            } else {
                if (readOnlyMode) {
                    if (props.task.taskSubGroupId)
                        return (
                            <div>
                                {managementMode && noManagementFiltrationIsOn() && (
                                    <RowHandler task={props.task} mode={2} />
                                )}
                                {
                                    taskSubGroups.find(
                                        (group) => group.id === props.task.taskSubGroupId
                                    ).name
                                }
                            </div>
                        );
                } else {
                    return (
                        <div>
                            {props.task.taskSubGroupId &&
                                managementMode &&
                                noManagementFiltrationIsOn() ? (
                                <RowHandler task={props.task} mode={2} />
                            ) : (
                                renderTransparentDragger()
                            )}
                            <TaskGroupSelect
                                currentGroupId={props.task.taskSubGroupId}
                                taskId={props.task.id}
                                taskGroups={taskSubGroups.filter(
                                    (subGroup) => subGroup.taskGroupId === props.task.taskGroupId
                                )}
                                handleOnChangeTaskGroup={handleOnChangeTaskSubGroup}
                                handleOnCreateNewGroup={handleOnCreateNewSubGroupAction}
                            />
                        </div>
                    );
                }
            }

            return (
                <div>
                    {props.task.taskSubGroupId && (
                        <>
                            <RowHandler task={props.task} mode={2} />
                            {
                                taskSubGroups.find(
                                    (group) => group.id === props.task.taskSubGroupId
                                ).name
                            }
                        </>
                    )}
                </div>
            );
        };

        const renderTaskGroupCell = () => {
            if (
                groupUpdatingData &&
                groupUpdatingData.taskId === props.task.id &&
                groupUpdatingData.mode === 0
            ) {
                return (
                    <div>
                        {renderTransparentDragger()}
                        <TextField
                            id="group-name-updating-field"
                            defaultValue={
                                taskGroups.find((group) => group.id === props.task.taskGroupId)
                                    .name
                            }
                            onBlur={(e) =>
                                handleOnBlurTaskGroupName(
                                    e.target.value,
                                    props.task.taskGroupId
                                )
                            }
                            onKeyDown={handleOnKeyDownEditableTextField}
                        />
                    </div>
                );
            } else if (readOnlyMode) {
                if (props.task.taskGroupId)
                    return (
                        <div>
                            {managementMode && noManagementFiltrationIsOn() && (
                                <RowHandler task={props.task} mode={1} />
                            )}
                            {
                                taskGroups.find((group) => group.id === props.task.taskGroupId)
                                    .name
                            }
                        </div>
                    );
            } else {
                return (
                    <div>
                        {props.task.taskGroupId &&
                            managementMode &&
                            noManagementFiltrationIsOn() ? (
                            <RowHandler task={props.task} mode={1} />
                        ) : (
                            renderTransparentDragger()
                        )}
                        <TaskGroupSelect
                            currentGroupId={props.task.taskGroupId}
                            taskId={props.task.id}
                            taskGroups={taskGroups}
                            handleOnChangeTaskGroup={handleOnChangeTaskGroup}
                            handleOnCreateNewGroup={handleOnCreateNewGroupAction}
                        />
                    </div>
                );
            }
        };

        const renderBranchCell = (solutionIndex, taskId, readOnlyMode) => {
            const selectedValue = getBranchSelectedValue(taskId, solutionIndex);

            if (readOnlyMode) {
                return (
                    <Tooltip title={selectedValue} arrow interactive>
                        <span>{selectedValue}</span>
                    </Tooltip>
                );
            } else {
                return (
                    <BranchSelect
                        solutionData={solutionBranches.find(
                            (solution) => solution.solutionIndex === solutionIndex
                        )}
                        selectedValue={selectedValue}
                        onChange={(newBranchName) =>
                            onChangeBranchSelect(newBranchName, taskId, solutionIndex)
                        }
                    />
                );
            }
        };

        const onChangeBranchSelect = (newBranchName, taskId, solutionIndex) => {
            const taskBranch = branchDataSets.find(
                (dataSet) => dataSet.devTaskId === taskId
            );

            if (Boolean(taskBranch)) {
                updateBranchDataSetBackend(
                    taskBranch.id,
                    solutionIndex,
                    newBranchName
                ).then((response) => {
                    dispatch(updateBranchDataSet(response));
                });
            } else {
                const newBranchDataSetId = generateGuid();
                addBranchDataSetBackend(newBranchDataSetId, taskId).then(() => {
                    updateBranchDataSetBackend(
                        newBranchDataSetId,
                        solutionIndex,
                        newBranchName
                    ).then((response) => {
                        dispatch(addBranchDataSet(response));
                    });
                });
            }
        };

        const getBranchSelectedValue = (taskId, solutionIndex) => {
            const branchDataSet = branchDataSets.find(
                (dataSet) => dataSet.devTaskId === taskId
            );

            if (Boolean(branchDataSet)) {
                getBranchNameFromSetByIndex(branchDataSet, solutionIndex);
            } else {
                return null;
            }
        };

        const renderTransparentDragger = () => (
            <DragIndicatorIcon style={{ color: "transparent" }} />
        );

        const handleMainDevSelected = (newMainDevId, updatingTaskId) => {
            let updatingTask = tasksData.find((task) => task.id === updatingTaskId);
            const prioritiesShiftData = tasksData
                .filter(
                    (task) =>
                        task.mainDevId === updatingTask.mainDevId &&
                        task.priorityForDeveloper > updatingTask.priorityForDeveloper
                )
                .map((task) => {
                    return {
                        taskId: task.id,
                        newPriorityIndex: --task.priorityForDeveloper,
                    };
                });

            updatingTask.priorityForDeveloper = tasksData.filter(
                (task) => task.mainDevId === newMainDevId
            ).length;
            updatingTask.mainDevId = newMainDevId;
            updatingTask.collaboratorsIds = updatingTask.collaboratorsIds.filter(
                (devId) => devId !== newMainDevId
            );

            dispatch(updateTasks([updatingTask]));
            dispatch(updatePriorities(prioritiesShiftData));
            updateTaskBackend(updatingTask);
            updatePrioritiesBackend(prioritiesShiftData);
        };

        const handleStatusSelected = (statusId, updatingTaskId) => {
            let updatingTask = tasksData.find((task) => task.id === updatingTaskId);
            updatingTask.status = statusId;
            dispatch(updateTasks([updatingTask]));
            updateTaskBackend(updatingTask);
        };

        const handleOnBlurTaskName = (newTaskName, updatingTaskId) => {
            let updatingTask = tasksData.find((task) => task.id === updatingTaskId);
            updatingTask.name = newTaskName;

            dispatch(updateTasks([updatingTask]));
            updateTaskBackend(updatingTask);
        };

        const handleOnChangeDate = (taskId, newDate, dateTypeIndex) => {
            let updatingTask = tasksData.find((task) => task.id === taskId);

            updateDateTimeBackend(
                taskId,
                Math.floor(newDate / 1000),
                dateTypeIndex,
                null
            ).then(({ success, newReturnedDate }) => {
                if (success) {
                    updateTaskDateByIndex(updatingTask, dateTypeIndex, newReturnedDate);
                    dispatch(updateTasks([updatingTask]));
                }
            });
        };

        const updateTaskDateByIndex = (updatingTask, dateTypeIndex, newDate) => {
            switch (dateTypeIndex) {
                case 0:
                    updatingTask.created = newDate;
                    break;
                case 1:
                    updatingTask.started = newDate;
                    break;
                case 2:
                    updatingTask.finished = newDate;
                    break;
                case 3:
                    updatingTask.tested = newDate;
                    break;
                case 4:
                    updatingTask.deployed = newDate;
                    break;
                default:
                    break;
            }
        };

        return (
            <TableRow
                className={"task-row"}
                key={props.task.id}
                onContextMenu={(e) => {
                    handleRowOnContextMenu(
                        e,
                        props.task.id,
                        false,
                        false,
                        false,
                        Boolean(props.task.taskGroupId, Boolean(props.task.taskSubGroupId))
                    );
                }}
            >
                <TableCell align="center" className="cell-dragger">
                    {managementMode && noManagementFiltrationIsOn() && (
                        <RowHandler task={props.task} mode={0} />
                    )}
                </TableCell>
                <TableCell align="center" className="cell-main-dev-name">
                    <DevsPopOverChip
                        readOnly={readOnlyMode}
                        dev={devs.find((dev) => dev.id === props.task.mainDevId)}
                        taskId={props.task.id}
                        handleDevSelected={handleMainDevSelected}
                        devsSource={devs.filter((dev) => dev.id !== props.task.mainDevId)}
                    />
                </TableCell>
                <TableCell align="center" className="cell-priority">
                    {props.task.tags.includes("onHold") ? (
                        <div>
                            <PauseCircleFilledIcon color="action" />
                        </div>
                    ) : (
                        props.task.priorityForDeveloper + 1
                    )}
                </TableCell>
                <TableCell
                    className="cell-task-group"
                    onContextMenu={(e) => {
                        handleRowOnContextMenu(
                            e,
                            props.task.id,
                            true,
                            false,
                            false,
                            Boolean(props.task.taskGroupId),
                            Boolean(props.task.taskSubGroupId)
                        );
                    }}
                >
                    {renderTaskGroupCell()}
                </TableCell>
                <TableCell
                    className="cell-task-sub-group"
                    onContextMenu={(e) => {
                        handleRowOnContextMenu(
                            e,
                            props.task.id,
                            true,
                            true,
                            false,
                            Boolean(props.task.taskGroupId),
                            Boolean(props.task.taskSubGroupId)
                        );
                    }}
                >
                    {renderTaskSubGroupCell()}
                </TableCell>
                <TableCell
                    className={
                        showCollaborators ? "cell-task-name-short" : "cell-task-name-long"
                    }
                    onContextMenu={(e) => {
                        handleRowOnContextMenu(
                            e,
                            props.task.id,
                            true,
                            true,
                            true,
                            Boolean(props.task.taskGroupId),
                            Boolean(props.task.taskSubGroupId)
                        );
                    }}
                >
                    <div>
                        {managementMode && noManagementFiltrationIsOn() && (
                            <RowHandler task={props.task} mode={3} />
                        )}
                        {readOnlyMode ? (
                            <Tooltip title={props.task.name} arrow interactive>
                                <span>{props.task.name}</span>
                            </Tooltip>
                        ) : (
                            <TextField
                                defaultValue={props.task.name}
                                onBlur={(e) => {
                                    handleOnBlurTaskName(e.target.value, props.task.id);
                                }}
                                onKeyDown={handleOnKeyDownEditableTextField}
                            />
                        )}
                    </div>
                </TableCell>
                {showCollaborators && (
                    <TableCell align="center" className="cell-collaborators">
                        <DevsChangingPopOver
                            readOnlyMode={readOnlyMode}
                            handleSaveDevs={handleSaveDevs}
                            taskId={props.task.id}
                            taskMainDevId={props.task.mainDevId}
                            taskCollaboratorIds={props.task.collaboratorsIds}
                            devs={devs}
                        />
                    </TableCell>
                )}
                <TableCell align="center" className="cell-status">
                    {!taskisLoading() && (
                        <div>
                            <StatusPopOverChip
                                className="status-chip"
                                readOnlyMode={readOnlyMode}
                                statusSource={statuses}
                                handleStatusSelected={handleStatusSelected}
                                taskId={props.task.id}
                                statusId={props.task.status}
                            />
                        </div>
                    )}
                </TableCell>
                <TableCell
                    align="center"
                    className="cell-last-action-date cell-date-picker"
                >
                    {renderLastActionDateCell()}
                </TableCell>
                <TableCell align="center" className="cell-action">
                    {renderActionButtons()}
                </TableCell>
                <TableCell
                    align="center"
                    className={
                        "cell-task-info" +
                        (showDatesInfo || showBranchesInfo ? " group-edge" : "")
                    }
                >
                    <IconButton
                        onClick={() => {
                            openTaskInfo(props.task);
                        }}
                    >
                        <ImportContactsIcon fontSize="medium" color={props.task.notes === '' && props.task.description === '' ? 'disabled' : "primary"} />
                    </IconButton>
                </TableCell>
                {showDatesInfo && (
                    <>
                        <TableCell
                            className={"cell-date-picker yellow-cell"}
                            align="center"
                        >
                            <DateTimePicker
                                dateName={"Created"}
                                date={props.task.created}
                                readOnly={readOnlyMode}
                                handleOnChangeDate={handleOnChangeDate}
                                taskId={props.task.id}
                                dateTypeIndex={0}
                                canEditDates={canEditDates}
                            />
                        </TableCell>
                        <TableCell
                            className={"cell-date-picker yellow-cell"}
                            align="center"
                        >
                            <DateTimePicker
                                dateName={"Started"}
                                date={props.task.started}
                                readOnly={readOnlyMode}
                                handleOnChangeDate={handleOnChangeDate}
                                taskId={props.task.id}
                                dateTypeIndex={1}
                                canEditDates={canEditDates}
                            />
                        </TableCell>
                        <TableCell
                            className={"cell-date-picker yellow-cell"}
                            align="center"
                        >
                            <DateTimePicker
                                dateName={"Finished"}
                                date={props.task.finished}
                                readOnly={readOnlyMode}
                                handleOnChangeDate={handleOnChangeDate}
                                taskId={props.task.id}
                                dateTypeIndex={2}
                                canEditDates={canEditDates}
                            />
                        </TableCell>
                        <TableCell
                            className={"cell-date-picker yellow-cell"}
                            align="center"
                        >
                            <DateTimePicker
                                dateName={"Tested"}
                                date={props.task.tested}
                                readOnly={readOnlyMode}
                                handleOnChangeDate={handleOnChangeDate}
                                taskId={props.task.id}
                                dateTypeIndex={3}
                                canEditDates={canEditDates}
                            />
                        </TableCell>
                        <TableCell
                            className={
                                "cell-date-picker yellow-cell" +
                                (showBranchesInfo ? " group-edge" : "")
                            }
                            align="center"
                        >
                            <DateTimePicker
                                dateName={"Deployed"}
                                date={props.task.deployed}
                                readOnly={readOnlyMode}
                                handleOnChangeDate={handleOnChangeDate}
                                taskId={props.task.id}
                                dateTypeIndex={4}
                                canEditDates={canEditDates}
                            />
                        </TableCell>
                    </>
                )}
                {showBranchesInfo && (
                    <>
                        <TableCell
                            align="center"
                            className="branch-info-cell highlighted-branches-cell"
                        >
                            {renderBranchCell(0, props.task.id, readOnlyMode)}
                        </TableCell>
                        <TableCell
                            align="center"
                            className="branch-info-cell highlighted-branches-cell"
                        >
                            {renderBranchCell(1, props.task.id, readOnlyMode)}
                        </TableCell>
                        <TableCell
                            align="center"
                            className="branch-info-cell highlighted-branches-cell"
                        ></TableCell>
                        <TableCell
                            align="center"
                            className="branch-info-cell highlighted-branches-cell group-edge"
                        >
                            {renderBranchCell(3, props.task.id, readOnlyMode)}
                        </TableCell>
                        <TableCell align="center" className="branch-info-cell">
                            {renderBranchCell(4, props.task.id, readOnlyMode)}
                        </TableCell>
                        <TableCell align="center" className="branch-info-cell">
                            {renderBranchCell(5, props.task.id, readOnlyMode)}
                        </TableCell>
                        <TableCell align="center" className="branch-info-cell">
                            {renderBranchCell(6, props.task.id, readOnlyMode)}
                        </TableCell>
                        <TableCell align="center" className="branch-info-cell">
                            {renderBranchCell(7, props.task.id, readOnlyMode)}
                        </TableCell>
                        <TableCell align="center" className="branch-info-cell">
                            {renderBranchCell(8, props.task.id, readOnlyMode)}
                        </TableCell>
                        <TableCell align="center" className="branch-info-cell">
                            {renderBranchCell(9, props.task.id, readOnlyMode)}
                        </TableCell>
                        <TableCell align="center" className="branch-info-cell">
                            {renderBranchCell(10, props.task.id, readOnlyMode)}
                        </TableCell>
                        <TableCell align="center" className="branch-info-cell">
                            {renderBranchCell(11, props.task.id, readOnlyMode)}
                        </TableCell>
                        <TableCell align="center" className="branch-info-cell group-edge">
                            {renderBranchCell(12, props.task.id, readOnlyMode)}
                        </TableCell>
                        <TableCell
                            align="center"
                            className="branch-info-cell highlighted-branches-cell"
                        >
                            {renderBranchCell(13, props.task.id, readOnlyMode)}
                        </TableCell>
                        <TableCell
                            align="center"
                            className="branch-info-cell highlighted-branches-cell"
                        >
                            {renderBranchCell(14, props.task.id, readOnlyMode)}
                        </TableCell>
                    </>
                )}
            </TableRow>
        );
    };

    const SortableTableBorderRowElement = (props) => {
        let emptyCells = [];
        const cellsCount =
            11 + (showDatesInfo ? 5 : 0) + (showBranchesInfo ? 15 : 0);

        for (let i = 0; i < cellsCount; i++) {
            emptyCells.push(
                <TableCell>
                    <div
                        style={{
                            backgroundColor: props.prevDev.associatedBackgroundColor,
                            height: "10px",
                        }}
                    />
                    <div
                        style={{
                            backgroundColor: props.nextDev.associatedBackgroundColor,
                            height: "10px",
                        }}
                    />
                </TableCell>
            );
        }

        return <TableRow className="border-row">{emptyCells}</TableRow>;
    };

    const renderTableRows = (props) => {
        const allRowsAreBorderRows = !tableRowsData.some(row => !row.isBorder)
        if (tableRowsData.length === 0 || allRowsAreBorderRows)
            return (
                <TableRow className="no-tasks-row">
                    <TableCell align="center" className="cell-dragger">
                        <div className="no-tasks-row">
                            No availible tasks satisfy current filtration
                        </div>
                    </TableCell>
                    <TableCell />
                </TableRow>
            );
        else
            return tableRowsData.map((row, rowIndex) => {
                return (
                    <SortableTableRow
                        key={`item-${rowIndex}`}
                        index={rowIndex}
                        isBorder={row.isBorder}
                        prevDev={row.prevDev}
                        nextDev={row.nextDev}
                        taskIndex={
                            row.isBorder
                                ? null
                                : tasksData.map((task) => task.id).indexOf(row.id)
                        }
                        task={row}
                        showDatesInfo={showDatesInfo}
                        showBranchesInfo={showBranchesInfo}
                        readOnlyMode={readOnlyMode}
                    />
                );
            });
    };

    return devs.length > 0 ? (
        <>
            <TableContainer className="table-container" component={Paper}>
                <SortableCont
                    onSortEnd={onSortEnd}
                    onSortStart={onSortStart}
                    onSortOver={onSortOver}
                    onSortMove={onSortMove}
                    axis="y"
                    lockAxis="y"
                    useDragHandle
                    // helperContainer={dragHelperContainer}
                    helperClass="active-drag-mode-row-main active-drag-mode-row"
                >
                    <Table className={classes.table} size="small" id="tasks-table">
                        <TableHead>
                            <TableRow className="black-row">
                                <TableCell align="center" className="cell-dragger">
                                    {adminMode && (
                                        <div>
                                            <IconButton
                                                className="filtering-header-icon"
                                                onClick={handleReadOnlyModeChange}
                                            >
                                                <EditIcon
                                                    fontSize="small"
                                                    color={readOnlyMode ? "disabled" : "primary"}
                                                />
                                            </IconButton>
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell align="center" className="cell-main-dev-name">
                                    {adminMode ? (
                                        <IconButton
                                            className="filtering-header-icon"
                                            onClick={handleOnClickManagementMode}
                                        >
                                            <FreeBreakfastIcon
                                                fontSize="small"
                                                color={managementMode ? "primary" : "disabled"}
                                            />
                                        </IconButton>
                                    ) : (
                                        <IconButton
                                            className="filtering-header-icon"
                                            onClick={handleOnClickAllTasksViewMode}
                                        >
                                            <PeopleIcon
                                                fontSize="small"
                                                color={allTasksViewMode ? "primary" : "disabled"}
                                            />
                                        </IconButton>
                                    )}
                                    Main
                                    <DevsFilteringPopOverButton
                                        filterDevIds={filterMainDevIds}
                                        setFilterDevIds={setMainFilterDevIds}
                                        devs={devs}
                                        tasks={tasksData}
                                        hidden={managementMode}
                                    />
                                </TableCell>
                                <TableCell align="center" className="cell-priority">
                                    <IconButton
                                        className="small-view-button"
                                        onClick={handleFilterShowOnHoldsChange}
                                    >
                                        <PauseCircleFilledIcon
                                            fontSize="small"
                                            color={filterShowOnHolds ? "primary" : "disabled"}
                                        />
                                    </IconButton>
                                </TableCell>
                                <TableCell align="left" className="cell-task-group">
                                    &nbsp; Task Group
                                    <GroupFilteringPopOver
                                        filterGroupIds={filterGroupIds}
                                        setFilterGroupIds={setFilterGroupIds}
                                        tasksData={tasksData}
                                        taskGroups={taskGroups}
                                        hidden={managementMode}
                                    />
                                </TableCell>
                                <TableCell align="left" className="cell-task-sub-group">
                                    Task Sub group
                                    <GroupFilteringPopOver
                                        filterGroupIds={filterSubGroupIds}
                                        setFilterGroupIds={setFilterSubGroupIds}
                                        tasksData={tasksData}
                                        taskGroups={taskSubGroups}
                                        subGroupMode
                                        hidden={managementMode}
                                    />
                                </TableCell>
                                <TableCell align="left" className="cell-task-name-short">
                                    <div>
                                        Task Name
                                        <IconButton
                                            className="small-view-button"
                                            onClick={handleShowCollaboratorsChange}
                                        >
                                            <GroupWorkIcon
                                                fontSize="small"
                                                color={showCollaborators ? "primary" : "disabled"}
                                            />
                                        </IconButton>
                                    </div>
                                </TableCell>

                                {showCollaborators && (
                                    <TableCell align="left" className="cell-collaborators">
                                        Collaborators
                                        <DevsFilteringPopOverButton
                                            filterDevIds={filterCollDevIds}
                                            setFilterDevIds={setCollFilterDevIds}
                                            tasks={tasksData}
                                            devs={devs}
                                            shortForm
                                            hidden={managementMode}
                                        />
                                    </TableCell>
                                )}

                                <TableCell align="center" className="cell-status">
                                    <StatusFilteringPopOver
                                        filterStatusIds={filterStatusIds}
                                        setFilterStatusIds={setFilterStatusIds}
                                        tasksData={tasksData}
                                        statuses={statuses}
                                        hidden={managementMode}
                                    />
                                </TableCell>
                                <TableCell align="center" className="cell-last-action-date">
                                    <div>
                                        {filterShowOnlyComplete ? (
                                            <img
                                                className={
                                                    "small-view-button-custom" +
                                                    (managementMode ? "" : " hidden-item")
                                                }
                                                alt=""
                                                src={inDevelopment}
                                                onClick={handleShowOnlyCompleteChange}
                                            />
                                        ) : (
                                            <img
                                                className={
                                                    "small-view-button-custom" +
                                                    (managementMode ? "" : " hidden-item")
                                                }
                                                alt=""
                                                src={inDevelopmentInactive}
                                                onClick={handleShowOnlyCompleteChange}
                                            />
                                        )}

                                        {filterShowOnlyIncomplete ? (
                                            <img
                                                className={
                                                    "small-view-button-custom" +
                                                    (managementMode ? "" : " hidden-item")
                                                }
                                                alt=""
                                                src={deployedToLive}
                                                onClick={handleShowOnlyIncompleteChange}
                                            />
                                        ) : (
                                            <img
                                                className={
                                                    "small-view-button-custom" +
                                                    (managementMode ? "" : " hidden-item")
                                                }
                                                alt=""
                                                src={deployedToLiveInactive}
                                                onClick={handleShowOnlyIncompleteChange}
                                            />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell align="center" className="cell-action">
                                    <div>
                                        <IconButton
                                            className="small-view-button"
                                            onClick={handleBranchesInfoChange}
                                        >
                                            <AccountTreeIcon
                                                fontSize="small"
                                                color={showBranchesInfo ? "primary" : "disabled"}
                                            />
                                        </IconButton>
                                        <IconButton
                                            className="small-view-button"
                                            onClick={handleDatesInfoChange}
                                        >
                                            <EventAvailableIcon
                                                fontSize="small"
                                                color={showDatesInfo ? "primary" : "disabled"}
                                            />
                                        </IconButton>
                                    </div>
                                </TableCell>
                                <TableCell align="center" className="cell-task-info">
                                    Info
                                </TableCell>

                                {showDatesInfo &&
                                    dateNamesArray.map((dateName) => (
                                        <TableCell align="center">{dateName}</TableCell>
                                    ))}

                                {showBranchesInfo &&
                                    microserviceNamesArray.map((microserviceName) => (
                                        <TableCell
                                            align="center"
                                            className="branch-info-header-cell"
                                        >
                                            {microserviceName}
                                        </TableCell>
                                    ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>{renderTableRows(props)}</TableBody>
                    </Table>
                </SortableCont>
            </TableContainer>
            {/* {!showDatesInfo && !showBranchesInfo && renderLegend()} */}
            {contextMenuAnchor && (
                <TableContextMenu
                    addRow={addRow}
                    removeRow={removeRow}
                    contextMenuAnchor={contextMenuAnchor}
                    setContextMenuAnchor={setContextMenuAnchor}
                    readOnlyMode={readOnlyMode}
                    adminMode={adminMode}
                    onHoldAction={handleOnHoldAction}
                    handleOnCreateNewGroupAction={handleOnCreateNewGroupAction}
                    handleOnCreateNewSubGroupAction={handleOnCreateNewSubGroupAction}
                    handleOnRenameGroupAction={handleOnRenameGroupAction}
                    handleOnRenameSubGroupAction={handleOnRenameSubGroupAction}
                />
            )}
            {taskModal && (
                <TaskInfoModal
                    taskModal={taskModal}
                    setTaskModal={setTaskModal}
                    readOnlyMode={readOnlyMode}
                    saveTask={handleUpdateTaskNameAndInfo}
                    adminMode={adminMode}
                />
            )}
        </>
    ) : (
        <div className="table-loading-bar-wrapper">
            <CircularProgress className="table-loading-bar" />
        </div>
    );
}

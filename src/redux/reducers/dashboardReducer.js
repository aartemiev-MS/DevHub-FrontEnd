import {
    UPDATE_TASKS,
    SET_MOUNT_DATA,
    ADD_TASK,
    ADD_BRANCH_DATA_SET,
    REMOVE_TASK,
    UPDATE_PRIORITIES,
    ADD_TASK_GROUP,
    UPDATE_TASK_GROUP_NAME,
    UPDATE_TASK_SUB_GROUP_NAME,
    ADD_TASK_SUB_GROUP,
    UPDATE_DRAG_HANDLER_DATA,
    UPDATE_BRANCH_DATA_SET
} from "../actions";

const initialState = {
    testItem: 'Sasha initial',
    devs: [],
    tasksData: [],
    taskGroups: [],
    taskSubGroups: [],
    dragHandlerData: null,
    loggedUser: null,
    solutionBranches: [],
    branchDataSets: []
};

export default function (state = initialState, action) {
    let newTasksData, newTaskGroups,newTaskSubGroups
    switch (action.type) {
        case SET_MOUNT_DATA: {
            return {
                ...state,
                devs: action.devs,
                tasksData: action.tasksData,
                taskGroups: action.taskGroups,
                taskSubGroups: action.taskSubGroups,
                loggedUser: action.loggedUser,
                solutionBranches: action.solutionBranches,
                branchDataSets: action.branchDataSets
            };
        }
        case UPDATE_TASKS: //update tasks
            newTasksData = state.tasksData.map(task => {
                const updatedTaskVersion = action.updatedTasks.find(updatedTask => updatedTask.id === task.id)
                if (updatedTaskVersion) {
                    return updatedTaskVersion
                } else
                    return task
            })
            return {
                ...state,
                tasksData: newTasksData
            };
        case ADD_TASK:
            return {
                ...state,
                tasksData: [...updatePriorities(state.tasksData, action.prioritiesShiftData), action.newTask]
            };
        case ADD_BRANCH_DATA_SET:
            debugger
            const aaa=[...state.branchDataSets, action.newBranchDataSet]
            return {
                ...state,
                branchDataSets: [...state.branchDataSets, action.newBranchDataSet]
            };
        case UPDATE_PRIORITIES:
            return {
                ...state,
                tasksData: updatePriorities(state.tasksData, action.prioritiesShiftData)
            };
        case REMOVE_TASK:
            newTasksData = updatePriorities(state.tasksData, action.prioritiesShiftData).filter(task => task.id !== action.removingTaskId)

            return {
                ...state,
                tasksData: newTasksData
            };
        case ADD_TASK_GROUP:
             newTaskGroups=state.taskGroups
            newTaskGroups.push({id:action.newTaskGroupId,name:""})
            return {
                ...state,
                taskGroups: newTaskGroups
            };
        case ADD_TASK_SUB_GROUP:
             newTaskSubGroups=state.taskSubGroups
            newTaskSubGroups.push({id:action.newTaskSubGroupId,name:"",taskGroupId:action.taskGroupId})
            return {
                ...state,
                taskSubGroups: newTaskSubGroups
            };
        case UPDATE_TASK_GROUP_NAME:
             newTaskGroups=state.taskGroups
            newTaskGroups.find(group=>group.id===action.taskGroupId).name=action.newName
            return {
                ...state,
                taskGroups: newTaskGroups
            };
        case UPDATE_TASK_SUB_GROUP_NAME:
                 newTaskSubGroups=state.taskSubGroups
            newTaskSubGroups.find(group=>group.id===action.taskSubGroupId).name=action.newName
            return {
                ...state,
                taskSubGroups: newTaskSubGroups
            };
        case UPDATE_DRAG_HANDLER_DATA:
            return {
                ...state,
                dragHandlerData: action.newData
            };
        case UPDATE_BRANCH_DATA_SET:
            const updatedBranchDataSets = state.branchDataSets.map(branchesSet=>branchesSet.id===action.updatedDataSet.id?action.updatedDataSet:branchesSet)
            return {
                ...state,
                branchDataSets: updatedBranchDataSets
            };
        default:
            return state;
    }
}

const updatePriorities = (tasksData, prioritiesShiftData) => {
    return tasksData.map(task => { // { taskId: xxx, newPriorityIndex: 000 }
        const updatedPriority = prioritiesShiftData.find(updatedPriority => updatedPriority.taskId === task.Id)
        if (updatedPriority)
            task.newPriorityForDeveloper = updatedPriority.newPriorityIndex
        return task
    })
}

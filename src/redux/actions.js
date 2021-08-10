export const ADD_TODO = "ADD_TODO";
export const TOGGLE_TODO = "TOGGLE_TODO";
export const SET_FILTER = "SET_FILTER";
export const SASHA_TEST = 'SASHA_TEST'
export const UPDATE_TASKS = 'UPDATE_TASKS'
export const SET_MOUNT_DATA = 'SET_MOUNT_DATA'
export const ADD_TASK = 'ADD_TASK'
export const REMOVE_TASK = 'REMOVE_TASK'
export const UPDATE_PRIORITIES = 'UPDATE_PRIORITIES'
export const UPDATE_TASK_GROUP_NAME = 'UPDATE_TASK_GROUP_NAME'
export const UPDATE_TASK_SUB_GROUP_NAME = 'UPDATE_TASK_SUB_GROUP_NAME'
export const ADD_TASK_GROUP = 'ADD_TASK_GROUP'
export const ADD_TASK_SUB_GROUP = 'ADD_TASK_SUB_GROUP'
export const UPDATE_DRAG_HANDLER_DATA = 'UPDATE_DRAG_HANDLER_DATA'

export const updateTasks = updatedTasks => ({
    type: UPDATE_TASKS,
    updatedTasks: updatedTasks
})

export const updatePriorities = prioritiesShiftData => ({
    type: UPDATE_PRIORITIES,
    prioritiesShiftData: prioritiesShiftData
})

export const addTask = (newTask, prioritiesShiftData) => ({
    type: ADD_TASK,
    newTask: newTask,
    prioritiesShiftData: prioritiesShiftData
})

export const removeTask = (removingTaskId, prioritiesShiftData) => ({
    type: REMOVE_TASK,
    removingTaskId: removingTaskId,
    prioritiesShiftData: prioritiesShiftData
})

export const setMountData = mountData => ({
    type: SET_MOUNT_DATA,
    devs: mountData.devs,
    tasksData: mountData.tasksData,
    taskGroups: mountData.taskGroups,
    taskSubGroups: mountData.taskSubGroups,
    loggedUserRole:mountData.loggedUserRole
})

export const addTaskGroup = newTaskGroupId => ({
    type: ADD_TASK_GROUP,
    newTaskGroupId: newTaskGroupId
})

export const addTaskSubGroup = (newTaskSubGroupId,taskGroupId) => ({
    type: ADD_TASK_SUB_GROUP,
    newTaskSubGroupId: newTaskSubGroupId,
    taskGroupId:taskGroupId
})

export const updateTaskGroupName = (newName,taskGroupId) => ({
    type: UPDATE_TASK_GROUP_NAME,
    taskGroupId: taskGroupId,
    newName:newName
})

export const updateTaskSubGroupName = (newName,taskSubGroupId) => ({
    type: UPDATE_TASK_SUB_GROUP_NAME,
    taskSubGroupId: taskSubGroupId,
    newName:newName
})

export const updateDragHandlerData = (newData) => ({
    type: UPDATE_DRAG_HANDLER_DATA,
    newData: newData
})

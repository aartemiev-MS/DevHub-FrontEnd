import {
    SASHA_TEST,
    UPDATE_TASKS,
    SET_MOUNT_DATA,
    ADD_TASK,
    REMOVE_TASK,
    UPDATE_PRIORITIES
} from "../actions";

const initialState = {
    testItem: 'Sasha initial',
    devs: [],
    tasksData: [],
    taskGroups: [],
    taskSubGroups: []
};

export default function (state = initialState, action) {
    let newTasksData
    switch (action.type) {
        case SET_MOUNT_DATA: {
            return {
                ...state,
                devs: action.devs,
                tasksData: action.tasksData,
                taskGroups: action.taskGroups,
                taskSubGroups: action.taskSubGroups
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

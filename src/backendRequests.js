const backendURL = "https://api.magnificentsystems.app"
//const backendURL = "https://localhost:5001"

export async function getMountData() {
    const response = await fetch(backendURL + "/Main/mount-data")
    const resp = await response.json();

    return resp
}

export async function addTaskBackend(newTask) {
    const requestData = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
    }
    const response = await fetch(backendURL + "/Main/add-new-task", requestData)
    const resp = await response.json();

    return resp
}

export async function removeTaskBackend(removingTaskId) {
    const requestData = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(removingTaskId)
    }
    const response = await fetch(backendURL + "/Main/remove-task", requestData)
    const resp = await response.json();

    return resp
}

export async function updatePrioritiesBackend(prioritiesShiftData) {
    const requestData = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(prioritiesShiftData)
    }
    const response = await fetch(backendURL + "/Main/update-priorities", requestData)
    const resp = await response.json();

    return resp
}

export async function updateTaskBackend(updatedTask) {
    const requestData = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTask)
    }
    const response = await fetch(backendURL + "/Main/update-task", requestData)
    const resp = await response.json();

    return resp
}

export async function updateDateTimeBackend(taskId, newDateOffset, dateTypeIndex) {
    const requestData = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ taskId: taskId, newDateOffset: newDateOffset, dateTypeIndex: dateTypeIndex })
    }

    const response = await fetch(backendURL + "/Main/update-datetime", requestData)
    const resp = await response.json();

    return resp
}

export async function editTaskGroupNameBackend(newTaskGroupName, editedTaskGroupId) {
    const request = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ taskGroupId: editedTaskGroupId, newName: newTaskGroupName })
    }

    const response = await fetch(backendURL + "/Main/edit-task-group-name", request);
    const responseResult = await response.json();

    return responseResult;
}

export async function editTaskSubGroupNameBackend(newTaskSubGroupName, editedTaskSubGroupId) {
    const request = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ taskSubGroupId: editedTaskSubGroupId, newName: newTaskSubGroupName })
    }

    const response = await fetch(backendURL + "/Main/edit-task-sub-group-name", request);
    const responseResult = await response.json();

    return responseResult;
}

export async function addTaskGroupBackend(newTaskGroupId) {
    const request = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newTaskGroupId)
    }

    const response = await fetch(backendURL + "/Main/add-task-group", request);
    const responseResult = await response.json();

    return responseResult;
}

export async function addTaskSubGroupBackend(newTaskSubGroupId, taskGroupId) {
    const request = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ newTaskSubGroupId: newTaskSubGroupId, taskGroupId: taskGroupId })
    }

    const response = await fetch(backendURL + "/Main/add-task-sub-group", request);
    const responseResult = await response.json();

    return responseResult;
}
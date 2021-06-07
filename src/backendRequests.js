export async function getMountData() {
    const response = await fetch("https://localhost:5001/Main/mount-data")
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
    const response = await fetch("https://localhost:5001/Main/add-new-task", requestData)
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
    const response = await fetch("https://localhost:5001/Main/remove-task", requestData)
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
    const response = await fetch("https://localhost:5001/Main/update-priorities", requestData)
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
    const response = await fetch("https://localhost:5001/Main/update-task", requestData)
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

    const response = await fetch("https://localhost:5001/Main/update-datetime", requestData)
    const resp = await response.json();

    return resp
}
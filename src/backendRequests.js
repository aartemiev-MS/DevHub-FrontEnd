import authService from "./components/api-authorization/AuthorizeService";

//const backendURL = "https://api.magnificentsystems.app"
const backendURL = "https://localhost:5001";

export async function getMountData() {
    const loggedUser = await authService.getUser();

    const response = await fetch(
        backendURL + `/Main/mount-data?loggedUserId=${loggedUser.sub}`
    );
    const resp = await response.json();

    return resp;
}

export async function addTaskBackend(newTask) {
    const requestData = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
    };

    const response = await fetch(backendURL + "/Main/add-new-task", requestData);
    const success = response.status === 200;
    return success;
}

export async function removeTaskBackend(removingTaskId) {
    const requestData = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(removingTaskId),
    };
    const response = await fetch(backendURL + "/Main/remove-task", requestData);
    const resp = await response.json();

    return resp;
}

export async function updatePrioritiesBackend(prioritiesShiftData) {
    const requestData = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(prioritiesShiftData),
    };

    const response = await fetch(
        backendURL + `/Main/update-priorities?dataTest=${prioritiesShiftData}`,
        requestData
    );
    const resp = await response.json();

    return resp;
}

export async function updateTaskBackend(updatedTask) {
    const requestData = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
    };

    const response = await fetch(backendURL + "/Main/update-task", requestData);
    const success = response.status === 200;

    return success;
}

export async function updateDateTimeBackend(
    taskId,
    newDateOffset,
    dateTypeIndex,
    nextStatus
) {
    const requestData = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    };

    const response = await fetch(
        backendURL +
        `/Main/update-datetime?newDateOffset=${newDateOffset}&dateTypeIndex=${dateTypeIndex}&taskId=${taskId}&nextStatus=${nextStatus ?? ""
        }`,
        requestData
    );
    const success = response.status === 200;

    const newReturnedDate = await response.json();

    return { success: success, newReturnedDate: newReturnedDate };
}

export async function editTaskGroupNameBackend(
    newTaskGroupName,
    editedTaskGroupId
) {
    const request = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        }
    };

    const response = await fetch(
        backendURL + `/Main/edit-task-group-name?editedTaskGroupId=${editedTaskGroupId}&newTaskGroupName=${newTaskGroupName}`,
        request
    );
    const responseResult = await response.json();

    return responseResult;
}

export async function editTaskSubGroupNameBackend(
    newTaskSubGroupName,
    editedTaskSubGroupId
) {
    const request = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
    };

    const response = await fetch(
        backendURL +
        `/Main/edit-task-sub-group-name?editedTaskSubGroupId=${editedTaskSubGroupId}&newTaskSubGroupName=${newTaskSubGroupName}`,
        request
    );
    const responseResult = await response.json();

    return responseResult;
}

export async function addTaskGroupBackend(newTaskGroupId) {
    const request = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newTaskGroupId),
    };

    const response = await fetch(backendURL + "/Main/add-task-group", request);
    const responseResult = await response.json();

    return responseResult;
}

export async function addTaskSubGroupBackend(newTaskSubGroupId, taskGroupId) {
    const request = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
    };

    const response = await fetch(
        backendURL +
        `/Main/add-task-sub-group?newTaskSubGroupId=${newTaskSubGroupId}&taskGroupId=${taskGroupId}`,
        request
    );
    const responseResult = await response.json();

    return responseResult;
}

export async function addBranchDataSetBackend(newBranchDataSetId, devTaskId) {
    const request = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
    };

    await fetch(
        backendURL +
        `/Main/add-branch-data-set?newBranchDataSetId=${newBranchDataSetId}&devTaskId=${devTaskId}`,
        request
    );

    return;
}

export async function updateBranchDataSetBackend(
    branchDataSetId,
    solutionIndex,
    newBranchName
) {
    const request = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
    };

    const response = await fetch(
        backendURL +
        `/Main/update-branch-data-set?branchDataSetId=${branchDataSetId}&solutionIndex=${solutionIndex}&newBranchName=${newBranchName}`,
        request
    );
    const responseResult = await response.json();

    return responseResult;
}

export async function sashaTest() {
    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    };

    const response = await fetch(
        backendURL + `/Test/SashaTest?firstParam=${"1"}&secondParam=${"2"}`,
        request
    );

    console.log("Sasha test React worked");
}

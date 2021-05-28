export async function getMountData() {
    const response = await fetch("https://localhost:5001/Main/mount-data")
    const resp = await response.json();

    return resp
}


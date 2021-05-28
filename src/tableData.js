import { getMountData } from './backendRequests'

const microServicesBranchData = [
    {
        Id: '0',
        Megalfa: 'demo',
        MegalfaHub: 'demo',
        Acomba: 'sa-dev-2',
        MAService: 'sa-dev-2',
        Identity: 'sa-dev-2',
        Registry: 'demo',
        Manufacturing: 'ds-dev-6',
        Shipping: 'demo',
        CrossRef: 'ds-dev-6',
        Catalog: 'demo',
        Customer: 'demo',
        Ordering: 'demo',
        Scheduling: 'demo',
        AOOHub: 'demo',
        AOO: 'ds-dev-6'
    },
    {
        Id: '1',
        Megalfa: 'sa-dev-2',
        MegalfaHub: 'demo',
        Acomba: 'demo',
        MAService: 'demo',
        Identity: 'demo',
        Registry: 'demo',
        Manufacturing: 'demo',
        Shipping: 'demo',
        CrossRef: 'demo',
        Catalog: 'demo',
        Customer: 'demo',
        Ordering: 'demo',
        Scheduling: 'demo',
        AOOHub: 'demo',
        AOO: 'demo'
    },
    {
        Id: '2',
        Megalfa: 'demo',
        MegalfaHub: 'demo',
        Acomba: 'demo',
        MAService: 'demo',
        Identity: 'y-dev-1',
        Registry: 'demo',
        Manufacturing: 'demo',
        Shipping: 'demo',
        CrossRef: 'demo',
        Catalog: 'demo',
        Customer: 'demo',
        Ordering: 'demo',
        Scheduling: 'demo',
        AOOHub: 'demo',
        AOO: 'demo'
    },

]

const microServicesBranchDataEmpty = {
    Id: '3',
    Megalfa: 'demo',
    MegalfaHub: 'demo',
    Acomba: 'demo',
    MAService: 'demo',
    Identity: 'demo',
    Registry: 'demo',
    Manufacturing: 'demo',
    Shipping: 'demo',
    CrossRef: 'demo',
    Catalog: 'demo',
    Customer: 'demo',
    Ordering: 'demo',
    Scheduling: 'demo',
    AOOHub: 'demo',
    AOO: 'demo'
}

const statuses = [
    { name: 'Not yet started', id: 0, actions: ['Start (code)'] },
    { name: 'In development', id: 1, actions: ['Done (code)'] },
    { name: 'Completed by Dev', id: 3, actions: ['Start (test)'] },
    { name: 'QA Testing', id: 4, actions: ['Pass', 'Fail'] },
    { name: 'Bug Fixing', id: 5, actions: ['Done (bugfix)'] },
    { name: 'Ready to deploy', id: 6, actions: ['Deploy'] },
    { name: 'Deployed', id: 7, actions: [] },
]

export function getDevs() {
    return [
        { id: 0, priority: 0, name: 'Sasha Artemiev', color: 'rgb(3, 86, 229)', isWhiteText: true },
        { id: 1, priority: 1, name: 'Denis Lopatin', color: 'rgb(255, 251, 0)', isWhiteText: false },
        { id: 2, priority: 2, name: 'Maxim Zelenko', color: 'rgb(3, 155, 229)', isWhiteText: true },
        { id: 3, priority: 3, name: 'Kirill Stakhevych', color: 'rgb(121, 85, 72)', isWhiteText: true },
        { id: 4, priority: 4, name: 'Yulia Chukhrii', color: 'rgb(97, 97, 97)', isWhiteText: true },
    ]
}

let demoData = [
    {
        id: '0',
        taskName: 'Shipping bug',
        taskGroup: 'Urgent MMR Bugs',
        taskSubGroup: 'Sub group 1',
        mainDev: getDevs()[4],
        devPriority: 1,
        collaborators: [],
        status: statuses[0],
        taskInfo: 'We need to find out why sometimes shipping fails',
        taskNotes: 'Notes of id=0',
        dates: {
            created: "2021-03-20T10:30",
            started: null,
            finished: null,
            tested: null,
            deployed: null
        },
        tags: ['Low priority', 'For Dom'],
        deploymentData: null,
        microServicesBranchData: microServicesBranchData[0]
    },
    {
        id: '1',
        taskName: 'CareOf table bug',
        taskGroup: 'Megalfa Bugs',
        taskSubGroup: 'Sub group 1',
        mainDev: getDevs()[2],
        devPriority: 1,
        collaborators: [getDevs()[0], getDevs()[3], getDevs()[4]],
        status: statuses[1],
        taskInfo: 'Endless exceptions in the EditCustomer form',
        taskNotes: 'Notes of id=1',
        dates: {
            created: "2021-04-10T10:30",
            started: "2021-04-20T12:10",
            finished: null,
            tested: null,
            deployed: null
        },
        tags: ['Urgent', 'For Dom', 'Report to Mel'],
        deploymentData: null,
        microServicesBranchData: microServicesBranchData[1]
    },
    {
        id: '2',
        taskName: 'AIS log out bug',
        taskGroup: 'Urgent MMR Bugs',
        taskSubGroup: 'Sub group 2',
        mainDev: getDevs()[0],
        devPriority: 1,
        collaborators: [getDevs()[3], getDevs()[4]],
        status: statuses[5],
        taskInfo: 'AIS suddenly logs user out',
        taskNotes: 'Notes of id=2',
        dates: {
            created: "2021-03-10T10:30",
            started: "2021-03-10T12:10",
            finished: "2021-03-12T12:10",
            tested: "2021-03-13T12:10",
            deployed: "2021-03-14T12:10"
        },
        tags: ['Urgent', 'Report to Mel'],
        deploymentData: null,
        microServicesBranchData: microServicesBranchData[2]
    },
    {
        id: '3',
        taskName: 'Quick Upload tool',
        taskGroup: 'Urgent MMR Bugs',
        taskSubGroup: 'Sub group 2',
        mainDev: getDevs()[1],
        devPriority: 1,
        collaborators: [getDevs()[0], getDevs()[3]],
        status: statuses[2],
        taskInfo: 'Harmonize the order of columns between code, instructions and screenshot. (use order in code)',
        taskNotes: 'Notes of id=3',
        dates: {
            created: null,
            started: null,
            finished: null,
            tested: null,
            deployed: null
        },
        tags: ['Urgent', 'Report to Mel'],
        deploymentData: null,
        microServicesBranchData: microServicesBranchData[2]
    },
    {
        id: '4',
        taskName: 'Quote edit',
        taskGroup: 'Urgent MMR Bugs',
        taskSubGroup: 'Sub group 2',
        mainDev: getDevs()[1],
        devPriority: 2,
        collaborators: [getDevs()[0], getDevs()[3], getDevs()[4]],
        status: statuses[3],
        taskInfo: 'Follow-up quote allows Print-all with optionsquote-pdf. Add popup menu to Follow-up quote with two sections',
        taskNotes: 'Notes of id=4',
        dates: {
            created: null,
            started: null,
            finished: null,
            tested: null,
            deployed: null
        },
        tags: ['onHold', 'Report to Mel'],
        deploymentData: null,
        microServicesBranchData: microServicesBranchData[2]
    }
]


export default function tableDataSource() {
    // getMountData().then(data => {
    //     return data
    // })
    return demoData.sort((v1, v2) => v1.mainDev.priority - v2.mainDev.priority)
}
export function getStatuses() { return statuses }
export function getEmptyTask(id, mainDev, newTaskGroup, newTaskSubGroup) {
    return {
        id: id,
        taskName: '',
        taskGroup: newTaskGroup,
        taskSubGroup: newTaskSubGroup,
        mainDev: mainDev,
        collaborators: [],
        status: statuses[0],
        taskInfo: '',
        dates: {
            created: null,
            started: null,
            finished: null,
            tested: null,
            deployed: null
        },
        tags: [],
        deploymentData: null,
        microServicesBranchData: microServicesBranchDataEmpty
    }
}
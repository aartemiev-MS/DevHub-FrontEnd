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
    { name: 'Not yet started', id: 0 },
    { name: 'In development', id: 1 },
    { name: 'On hold', id: 2 },
    { name: 'Completed by Dev', id: 3 },
    { name: 'Tested by QA', id: 4 },
    { name: 'Bug Detected', id: 5 },
    { name: 'Ready to deploy', id: 6 },
    { name: 'Deployed', id: 7 },
]

export function getDevs() {
    return [
        { id: 0, name: 'Sasha' },
        { id: 1, name: 'Denis' },
        { id: 2, name: 'Max' },
        { id: 3, name: 'Kirill' },
        { id: 4, name: 'Yulia' },
    ]
}

let demoData = [
    {
        id: '0',
        taskName: 'Shipping bug',
        taskGroup: 'Urgent MMR Bugs',
        taskSubGroup: 'Sub group 1',
        mainDev: getDevs()[4],
        collaborators: [getDevs()[0], getDevs()[1]],
        status: statuses[0],
        taskInfo: 'We need to find out why sometimes shipping fails',
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
        collaborators: [getDevs()[0], getDevs()[3], getDevs()[4]],
        status: statuses[1],
        taskInfo: 'Endless exceptions in the EditCustomer form',
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
        collaborators: [getDevs()[3], getDevs()[4]],
        status: statuses[7],
        taskInfo: 'AIS suddenly logs user out',
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
    }
]


export default function tableDataSource() { return demoData }
export function getStatuses() { return statuses }
export function getEmptyTask() {
    return {
        id: '3',
        taskName: '',
        taskGroup: '',
        taskSubGroup: '',
        mainDev: '',
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
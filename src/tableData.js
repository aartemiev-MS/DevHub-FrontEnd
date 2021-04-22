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

]

const statuses = [
    { name: 'Not yet started', id: 0 },
    { name: 'In development', id: 1 },
    { name: 'On hold', id: 2 },
    { name: 'Completed by Dev', id: 3 },
    { name: 'Tested by QA', id: 4 },
    { name: 'Ready to deploy', id: 5 },
    { name: 'Deployed', id: 6 },
]

let demoData = [
    {
        id: '0',
        taskName: 'Shipping bug',
        devs: ['Sasha', 'Denis'],
        status: statuses[0],
        taskInfo: 'We need to find out why sometimes shipping fails',
        dates: {
            created: "2021-03-20T10:30",
            started: null,
            finished: null,
            tested: null
        },
        tags: ['Low priority', 'For Dom'],
        deploymentData: null,
        microServicesBranchData: microServicesBranchData[0]
    },
    {
        id: '1',
        taskName: 'CareOf table bug',
        devs: ['Sasha', 'Yulia', 'Kirill'],
        status: statuses[1],
        taskInfo: 'Endless exceptions in the EditCustomer form',
        dates: {
            created: "2021-04-10T10:30",
            started: "2021-04-20T12:10",
            finished: null,
            tested: null
        },
        tags: ['Urgent', 'For Dom', 'Report to Mel'],
        deploymentData: null,
        microServicesBranchData: microServicesBranchData[1]
    }
]


export default function tableData() { return demoData }
export function getStatuses() { return statuses }
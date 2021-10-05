import notStarted from "./assets/icons/Not started.svg";
import inDevelopment from "./assets/icons/In development.svg";
import completed from "./assets/icons/Completed.svg";
import qaTesting from "./assets/icons/qa testing.svg";
import testFailed from "./assets/icons/test failed.svg";
import bugFixing from "./assets/icons/bug fixing.svg";
import readyToDeploy from "./assets/icons/ready to deploy.svg";
import deployedToDemo from "./assets/icons/demo.svg";
import deployedToLive from "./assets/icons/live.svg";

export const statuses = [
  {
    statusName: "Not yet started",
    id: 0,
    icon: notStarted,
    actions: [{ actionName: "Start (code)", nextStatus: 1 }],
  },
  {
    statusName: "In development",
    id: 1,
    icon: inDevelopment,
    actions: [{ actionName: "Done (code)", nextStatus: 2 }],
  },
  {
    statusName: "Completed by Dev",
    id: 2,
    icon: completed,
    actions: [{ actionName: "Start (test)", nextStatus: 3 }],
  },
  {
    statusName: "QA Testing",
    id: 3,
    icon: qaTesting,
    actions: [
      { actionName: "Pass", nextStatus: 6 },
      { actionName: "Fail", nextStatus: 4 },
    ],
  },
  {
    statusName: "Test Failed",
    id: 4,
    icon: testFailed,
    actions: [{ actionName: "Start (code)", nextStatus: 1 }],
  },
  {
    statusName: "Bug Fixing",
    id: 5,
    icon: bugFixing,
    actions: [{ actionName: "Done (bugfix)", nextStatus: 3 }],
  },
  {
    statusName: "Ready to deploy",
    id: 6,
    icon: readyToDeploy,
    actions: [{ actionName: "Deploy to Demo", nextStatus: 7 }],
  },
  {
    statusName: "Deployed To Demo",
    id: 7,
    icon: deployedToDemo,
    actions: [
      { actionName: "Approve", nextStatus: 9 },
      { actionName: "Reject", nextStatus: 8 }
    ],
  },
  {
    statusName: "Failed Delivery Review",
    id: 8,
    icon: notStarted,
    actions: [{ actionName: "Start (code)", nextStatus: 1 }],
  },
  {
    statusName: "Approved for Live",
    id: 9,
    icon: notStarted,
    actions: [{ actionName: "Deploy to Live", nextStatus: 10 }],
  },
  { statusName: "Deployed To Live", id: 10, icon: deployedToLive, actions: [] },
];

export const dateNamesArray = ["Created", "Started", "Finished", "Tested", "Deployed"];

export const microserviceNamesArray = [
  "Megalfa",
  "MegalfaHub",
  "Acomba",
  "MAService",
  "Identity",
  "Registry",
  "Manufacturing",
  "Shipping",
  "CrossRef",
  "Catalog",
  "Customer",
  "Ordering",
  "Scheduling",
  "AOOHub",
  "AOO",
];

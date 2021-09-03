export function getEmptyTask(
    id,
    mainDevId,
    priorityForDeveloper,
    newTaskGroupId,
    newTaskSubGroupId,
    newTaskName
  ) {
    return {
      id: id,
      name: newTaskName,
      description: "",
      notes: "",
      priorityForDeveloper: priorityForDeveloper,
      taskGroupId: newTaskGroupId,
      taskSubGroupId: newTaskSubGroupId,
      mainDevId: mainDevId,
      collaboratorsIds: [],
      status: 0,
      taskInfo: "",
      created: null,
      started: null,
      finished: null,
      tested: null,
      deployed: null,
      tags: [],
      deploymentData: null,
      branchDataId: null,
    };
  }
  
  export function getBranchNameFromSetByIndex(branchDataSet,solutionIndex){
    switch (solutionIndex) {
        case 0:
          return branchDataSet.megalfa;
        case 1:
          return branchDataSet.megalfaHub;
        case 2:
          return branchDataSet.acomba;
        case 3:
          return branchDataSet.maService;
        case 4:
          return branchDataSet.identity;
        case 5:
          return branchDataSet.registry;
        case 6:
          return branchDataSet.manufacturing;
        case 7:
          return branchDataSet.shipping;
        case 8:
          return branchDataSet.crossRef;
        case 9:
          return branchDataSet.catalog;
        case 10:
          return branchDataSet.customer;
        case 11:
          return branchDataSet.ordering;
        case 12:
          return branchDataSet.scheduling;
        case 13:
          return branchDataSet.aooHub;
        case 14:
          return branchDataSet.aoo;

        default:
          return null;
      }
  }
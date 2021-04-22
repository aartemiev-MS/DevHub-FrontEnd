import React, { useState } from 'react'
import TasksTable from '../src/components/tasksTable'
import DetailedTaskInfoPage from '../src/components/DetailedTaskInfoPage'
import ControlPanel from '../src/components/ControlPanel'

function App() {
  const [detailedTaskInfo, setDetailedTaskInfo] = useState(null)
  const [showBranchesInfo, setShowBranchesInfo] = useState(false)
  const [showDatesInfo, setShowDatesInfo] = useState(false)

  return (
    <div className="App">
      <ControlPanel
        showBranchesInfo={showBranchesInfo}
        setShowBranchesInfo={setShowBranchesInfo}
        showDatesInfo={showDatesInfo}
        setShowDatesInfo={setShowDatesInfo} />

      <TasksTable
        showDateInfo={showDatesInfo}
        showBranchesInfo={showBranchesInfo}
        showDatesInfo={showDatesInfo}
        setDetailedTaskInfo={setDetailedTaskInfo} />

      {detailedTaskInfo && <DetailedTaskInfoPage detailedTaskInfo={detailedTaskInfo} setDetailedTaskInfo={setDetailedTaskInfo} />}
    </div>
  );
}

export default App;

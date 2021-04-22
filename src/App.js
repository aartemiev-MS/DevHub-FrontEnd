import React, { useState } from "react";
import TasksTable from "../src/components/tasksTable";
import DetailedTaskInfoPage from "../src/components/DetailedTaskInfoPage";
import ControlPanel from "../src/components/ControlPanel";
import { BrowserRouter, Route } from "react-router-dom";
import { ApplicationPaths } from "./components/api-authorization/ApiAuthorizationConstants";
import ApiAuthorizationRoutes from "./components/api-authorization/ApiAuthorizationRoutes";
import AuthorizeRoute from "./components/api-authorization/AuthorizeRoute";

function Dashboard() {
  const [detailedTaskInfo, setDetailedTaskInfo] = useState(null);
  const [showBranchesInfo, setShowBranchesInfo] = useState(false);
  const [showDatesInfo, setShowDatesInfo] = useState(false);
  return (
    <>
      <ControlPanel
        showBranchesInfo={showBranchesInfo}
        setShowBranchesInfo={setShowBranchesInfo}
        showDatesInfo={showDatesInfo}
        setShowDatesInfo={setShowDatesInfo}
      />

      <TasksTable
        showDateInfo={showDatesInfo}
        showBranchesInfo={showBranchesInfo}
        showDatesInfo={showDatesInfo}
        setDetailedTaskInfo={setDetailedTaskInfo}
      />

      {detailedTaskInfo && (
        <DetailedTaskInfoPage
          detailedTaskInfo={detailedTaskInfo}
          setDetailedTaskInfo={setDetailedTaskInfo}
        />
      )}
    </>
  );
}

function App() {
  return (
    <div className='App'>
      {/* <BrowserRouter>
        <Route exact path='/'>
          Not logged in
        </Route>
        <AuthorizeRoute path='/dashboard' component={Dashboard} />
        <Route
          path={ApplicationPaths.ApiAuthorizationPrefix}
          component={ApiAuthorizationRoutes}
        />
      </BrowserRouter> */}
      <Dashboard />
    </div>
  );
}

export default App;

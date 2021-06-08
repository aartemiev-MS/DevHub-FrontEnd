import React, { useState } from "react";
import TasksTable from "../src/components/tasksTable";
import DetailedTaskInfoPage from "../src/components/DetailedTaskInfoPage";
import ControlPanel from "../src/components/ControlPanel";
import { BrowserRouter, Route } from "react-router-dom";
import { ApplicationPaths } from "./components/api-authorization/ApiAuthorizationConstants";
import ApiAuthorizationRoutes from "./components/api-authorization/ApiAuthorizationRoutes";
import AuthorizeRoute from "./components/api-authorization/AuthorizeRoute";

import { Provider } from "react-redux";
import store from "./redux/store";

function Dashboard() {
  return (
    <>
      <ControlPanel />

      <TasksTable />
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <div className='App'>
        <BrowserRouter>
        <Route exact path='/'>
          Not logged in
        </Route>
        <AuthorizeRoute path='/dashboard' component={Dashboard} />
        <Route
          path={ApplicationPaths.ApiAuthorizationPrefix}
          component={ApiAuthorizationRoutes}
        />
      </BrowserRouter>
        {/* <Dashboard /> */}
      </div>
    </Provider>
  );
}

export default App;

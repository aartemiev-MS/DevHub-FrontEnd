import React, { useState } from "react";
import TasksTable from "../src/components/tasksTable";
import DetailedTaskInfoPage from "../src/components/DetailedTaskInfoPage";
import ControlPanel from "../src/components/ControlPanel";
import { BrowserRouter, Route } from "react-router-dom";
import { ApplicationPaths } from "./components/api-authorization/ApiAuthorizationConstants";
import ApiAuthorizationRoutes from "./components/api-authorization/ApiAuthorizationRoutes";
import AuthorizeRoute from "./components/api-authorization/AuthorizeRoute";
import {  useSelector } from 'react-redux';

import { Provider } from "react-redux";
import store from "./redux/store";

function Dashboard() {
  const dragHandlerData = useSelector((state) => state.dashboardReducer.dragHandlerData)
  const [conrolPanelMessage, setConrolPanelMessage] = useState("")
  return (
    <>
      <ControlPanel conrolPanelMessage={conrolPanelMessage}/>

      <TasksTable dragHandlerData={dragHandlerData} setConrolPanelMessage={setConrolPanelMessage}/>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <div className='App'>
        <BrowserRouter>
        <AuthorizeRoute path='/' component={Dashboard} />
        <Route
          path={ApplicationPaths.ApiAuthorizationPrefix}
          component={ApiAuthorizationRoutes}
        />
        <Route
          path={ApplicationPaths.LogOut}
          component={ApiAuthorizationRoutes}
        />
      </BrowserRouter>
      </div>
    </Provider>
  );
}

export default App;

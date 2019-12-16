
//this is a fairly standard App frame. 
//I do something like this for all my react projects.
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import NavBar from "app/landmarks/NavBar";
import { staticRoutes } from "app/staticRoutes";

import PeoplePage from "app/pages/PeoplePage";
import ViolationsPage from "app/pages/ViolationsPage";

import { usePageAlerts } from "./utils/alerts";
import PageAlertsContext from "./landmarks/PageAlertsContext";
import MainContent from "./components/widgets/MainContent";

const App = () => {
  const pageAlerts = usePageAlerts();
  return (
    <PageAlertsContext.Provider value={pageAlerts}>
      <Router>
        <NavBar />
        <MainContent>
          <Switch>
            <Route path={staticRoutes.company}>
              <div>CompanyPage</div>
            </Route>
            <Route path={staticRoutes.people}>
              <PeoplePage />
            </Route>
            <Route path={staticRoutes.violations}>
              <ViolationsPage />
            </Route>
            <Route path={staticRoutes.statistics}>
              <div>StatisticsPage</div>
            </Route>
            <Route path={staticRoutes.settings}>
              <div>SettingsPage</div>
            </Route>
            <Route path={staticRoutes.profile}>
              <div>ProfilePage</div>
            </Route>
            <Redirect to={staticRoutes.people} />
          </Switch>
        </MainContent>
      </Router>
    </PageAlertsContext.Provider>
  );
};

export default App;
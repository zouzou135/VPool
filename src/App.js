import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import history from "./history";
import './App.css';
import Dashboard from './components/Dashboard';
import RegisterDriver from './components/RegisterDriver';
import RegisterVehicle from './components/RegisterVehicle';
import Reports from './components/Reports';
import Login from './components/Login';
import DriverList from './components/DriverList';
import VehicleList from './components/VehicleList';
import AssignTrip from './components/AssignTrip';
import Settings from './components/Settings';
import ChooseOnMap from './components/ChooseOnMap';

function App() {


  return (
    <div>
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/Login" component={Login} />
          <Route exact path="/RegisterDriver" render={(props) => <RegisterDriver {...props} />} />
          <Route exact path="/RegisterVehicle" render={(props) => <RegisterVehicle {...props} />} />
          <Route exact path="/Reports" component={Reports} />
          <Route exact path="/DriverList" component={DriverList} />
          <Route exact path="/VehicleList" component={VehicleList} />
          <Route exact path="/AssignTrip" render={(props) => <AssignTrip {...props} />} />
          <Route exact path="/Settings" component={Settings} />
          <Route exact path="/ChooseOnMap" render={(props) => <ChooseOnMap {...props} />} />
          {/* <Route key="search" path="/search/:searchTerm" render={props => <Home {...props} />} /> */}
        </Switch>
      </Router>
    </div>
  );
}

export default App;

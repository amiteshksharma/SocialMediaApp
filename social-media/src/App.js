import React from 'react';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Login from './Pages/Login';
import Main from './Pages/Main';
import Create from './Pages/Create';
import Profile from './Pages/Profile';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Login}></Route>
          <Route path="/home" component={Main} />
          <Route path="/create" component={Create} />
          <Route path="/profile" component={Profile} />
        </Switch>  
      </div>
    </Router>
  );
}

export default App;

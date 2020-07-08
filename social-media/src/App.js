import React from 'react';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Login from './Pages/Login';
import Main from './Pages/Main';
import Create from './Pages/Create';
import Profile from './Pages/Profile';
import Signup from './Pages/Signup';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Login}></Route>
          <Route path="/home" component={Main} />
          <Route path="/create" component={Create} />
          <Route exact path="/profile" component={Profile} />
          <Route path="/profile/:email" component={Profile} />
          <Route path="/signup" component={Signup} />
        </Switch>  
      </div>
    </Router>
  );
}

export default App;

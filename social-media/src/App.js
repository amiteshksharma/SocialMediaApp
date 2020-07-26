import React from 'react';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Login from './Pages/Login';
import Main from './Pages/Main';
import Create from './Pages/Create';
import Profile from './Pages/Profile';
import Signup from './Pages/Signup';
import Users from './Pages/Users';
import Explore from './Pages/Explore';
import Post from './Pages/Post';
import Area from './Pages/Area';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Login}></Route>
          <Route exact path="/area" component={Area} />
          <Route path="/home" component={Main} />
          <Route path="/create" component={Create} />
          <Route exact path="/profile/:email" component={Profile} />
          <Route exact path="/profile/:email/:follow" component={Users} />
          <Route path="/signup" component={Signup} />
          <Route path="/explore" component={Explore} />
          <Route path="/post/:email/:title" component={Post} />
        </Switch>  
      </div>
    </Router>
  );
}

export default App;

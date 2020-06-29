import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import './App.css';
import Login from './Pages/Login';


function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route to="/" component={Login} />
        </Switch>  
      </div>
    </Router>
  );
}

export default App;

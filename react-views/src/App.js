import React from 'react';
import './css/App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import Profile from './components/Profile.jsx';
import Schedule from './components/Schedule.jsx';

function App() {
  return (
    <Router>
        <Switch>
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Route path="/profile/:name" exact component={Profile} />
            <Route path="/schedule/:name" exact component={Schedule} />
            <Route path="*" component={()=>(<div>NoMatch</div>)} />
        </Switch>
    </Router>
  );
}

export default App;
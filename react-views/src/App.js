import React from 'react';
import './css/App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';

function App() {
  return (
    <Router>
        <Switch>
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Route path="*" component={()=>(<div>NoMatch</div>)} />
        </Switch>
    </Router>
  );
}

export default App;
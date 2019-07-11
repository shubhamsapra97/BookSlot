import React from 'react';
import './css/App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Display from './components/Display.jsx';

function App() {
  return (
    <Router>
        <Switch>
            <Route path="/" exact component={Display} />
            <Route path="*" component={()=>(<div>NoMatch</div>)} />
        </Switch>
    </Router>
  );
}

export default App;
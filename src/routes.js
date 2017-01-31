import React from 'react';
import {Router, Route, IndexRoute} from 'react-router';

import App from './App';
import Home from './Home';
import Form from './Form';

const Routes = (props) => (
    <Router {...props}>
        <Route path="/" component={App}>
            <IndexRoute component={(props) => (<Home {...props} />)}/>
            <Route path="/add" component={(props) => (<Form {...props}/>)}/>
        </Route>
    </Router>
);
export default Routes;
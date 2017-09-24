import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import { UserIsAuthenticated } from './util/wrappers.js'

// Layouts
import App from './App'
import Home from './layouts/home/Home'
import Dashboard from './layouts/dashboard/Dashboard'
import Profile from './user/layouts/profile/Profile'
import Hive from './layouts/hive/Hive'
import AddHive from './layouts/hive/addHive'
import Faucet from  './layouts/faucet/Faucet'

// Redux Store
import store from './store'

const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render((
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={Home} />
          <Route path="profile" component={UserIsAuthenticated(Profile)} />
          <Route path="hive/new" component={AddHive} />
          <Route path="hive/:name" component={Hive} />          
          <Route path="faucet/:name" component={Faucet} />
        </Route>
      </Router>
    </Provider>
  ),
  document.getElementById('root')
)

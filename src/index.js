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
import Hives from './layouts/hives/Hives'
import Hive from './layouts/hives/Hive'
import AddHive from './layouts/hives/AddHive'
import HoneyFaucet from  './layouts/faucet/HoneyFaucet'
import BeeFaucet from  './layouts/faucet/BeeFaucet'

import Page404 from  './layouts/errors/404'

// Redux Store
import store from './store'

const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render((
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={Home} />
          <Route path="profile" component={UserIsAuthenticated(Profile)} />

          <Route path="hives" component={Hives} />
          <Route path="hives/new" component={AddHive} />
          <Route path="hives/:name" component={Hive} />

          <Route path="faucet/bee" component={BeeFaucet} />
          <Route path="faucet/hny" component={HoneyFaucet} />

          <Route path='*' exact={true} component={Page404} />
        </Route>
      </Router>
    </Provider>
  ),
  document.getElementById('root')
)

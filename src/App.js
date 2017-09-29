import React, { Component } from 'react'
import { Link } from 'react-router'
import { HiddenOnlyAuth, VisibleOnlyAuth } from './util/wrappers.js'

// UI Components
import LoginButtonContainer from './user/ui/loginbutton/LoginButtonContainer'
import LogoutButtonContainer from './user/ui/logoutbutton/LogoutButtonContainer'

// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import {loadWeb3} from "./web3/getWeb3";
import {createDependencies} from "./web3/dependencies";
import store from "./store";
import {updateBalance, updatedBalance} from "./layouts/faucet/balanceActions";

// Not sure where the best place to instantiate dependencies is.
// This is a slow process though and should be moved somewhere where it doesn't effect start up time.

// Also, this gets the web3 object from the local provider, this could be testrpc, MetaMask, Parity etc.
// We could alternatively use the web3 instance provided by uPort, this would mean all transactions would
// need to be confirmed on the users device and faucet claims would be transferred to the users uPort address.
// However, to use the uPort web3 object the contracts would have to be deployed to Rinkeby and the user
// would have to log in through uPort before executing any transactions.
loadWeb3
    .then(web3 => {
      createDependencies(web3)
      store.dispatch(updateBalance())
    })

class App extends Component {
  render() {
    const OnlyAuthLinks = VisibleOnlyAuth(() =>
      <span>
        <li className="pure-menu-item">
          <Link to="/profile" className="pure-menu-link">Profile</Link>
        </li>
        <li className="pure-menu-item">
          <LogoutButtonContainer />
        </li>

      </span>
    )

    const OnlyGuestLinks = HiddenOnlyAuth(() =>
      <span>
      </span>
    )

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <Link to="/" className="pure-menu-heading pure-menu-link">HiveCommons</Link>
          <ul className="pure-menu-list navbar-right">
            <li className="pure-menu-item">
              <Link className="pure-menu-link" to="/hives">Hives</Link>
            </li>
            <li className="pure-menu-item">
              <Link className="pure-menu-link" to="/faucet/bee">BEE Faucet</Link>
            </li>
            <li className="pure-menu-item">
              <Link className="pure-menu-link" to="/faucet/hny">HNY Faucet</Link>
            </li>
            <OnlyGuestLinks />
            <OnlyAuthLinks />
          </ul>
        </nav>

        {this.props.children}
      </div>
    );
  }
}

export default App

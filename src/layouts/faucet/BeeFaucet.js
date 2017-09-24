import React, {Component} from 'react'
import {Link} from 'react-router'
import { HiddenOnlyAuth, VisibleOnlyAuth } from '../../util/wrappers.js'

// UI Components
import LoginButtonContainer from '../../user/ui/loginbutton/LoginButtonContainer'
import LogoutButtonContainer from '../../user/ui/logoutbutton/LogoutButtonContainer'

class BeeFaucet extends Component {
  constructor(props, {authData}) {
    super(props)
    authData = this.props
  }

  render() {

    const OnlyAuthLinks = VisibleOnlyAuth(() =>
      <div>
        <button className="pure-button button-xlarge">Claim BEE Token</button>
      </div>
    )

    const OnlyGuestLinks = HiddenOnlyAuth(() =>
      <div>
        <p>Sign in with uPort to claim your BEE token</p>
        <LoginButtonContainer />
      </div>
    )

    return (
      <main className = "container">
        <div className = "pure-g">
          <div className = "pure-u-1-1">
            <h1> Bee Faucet</h1>
            <OnlyGuestLinks />
            <OnlyAuthLinks />
          </div>
        </div>
     </main>
    )
  }
}

export default BeeFaucet

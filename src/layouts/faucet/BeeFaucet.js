import React, {Component} from 'react'
import {Link} from 'react-router'
import { HiddenOnlyAuth, VisibleOnlyAuth } from '../../util/wrappers.js'
import {beeFaucetBridge} from "../../web3/dependencies";

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
        <button className="pure-button button-xlarge" onClick={() => {
            // We probably want a loading spinner to appear somewhere while we wait for the tx to be mined. It can be stopped once the promise returns.
            beeFaucetBridge.claimBeeToken("Put the 'verified.0.claim.jwt' here from the 'requestCredentials()' response ").then(() => console.log("Bee Token Claim tx has been mined (doesn't necessarily mean it has given the user a token though)"))
        }}>Claim BEE Token</button>
      </div>
    )

    const OnlyGuestLinks = HiddenOnlyAuth(() =>
      <div>
        <p>Sign in with uPort to claim your BEE token</p>
        <LoginButtonContainer />
      </div>
    )

      const AttestationLink = () =>
          <div>
              <br/>
              <button className="pure-button button-xlarge" onClick={() => {
                  generateUniquenessAttestation("Put 'address' from 'requestCredentials()' response")
              }}>Create Attestation for logged in user</button>
              <br/>
              Note that this would actually be granted to the user by a third party / KYC provider.
          </div>

    return (
      <main className = "container">
        <div className = "pure-g">
          <div className = "pure-u-1-1">
            <h1> Bee Faucet</h1>
            <OnlyGuestLinks />
            <OnlyAuthLinks />
              <AttestationLink/>
          </div>
        </div>
     </main>
    )
  }
}

export default BeeFaucet

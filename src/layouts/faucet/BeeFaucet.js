import React, {Component} from 'react'
import {Link} from 'react-router'
import {HiddenOnlyAuth, VisibleOnlyAuth} from '../../util/wrappers.js'
import {beeTokenBridge, web3Bridge} from "../../web3/dependencies";
import {generateUniquenessAttestation} from "../../web3/attestationBridge";

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
          // Also we should have a field showing the users current balance of BEE and update it once we have successfully claimed from the BEE faucet.
          // We can get the balance with beeTokenBridge.getBeeTokenBalance([users address]).then(balance => do something with balance)
          // We can get the users public address with web3Bridge.getUsersAccounts().then(accounts => console.log(accounts[0])).
          // The first account in the returned array is the one that is used for everything unless specified otherwise.

          // Put the 'verified.0.claim.jwt' from the 'requestCredentials()' response in place of the long string. (You will have to log in again if the attestation was granted since originally logging in)
          beeTokenBridge.claimBeeToken("eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJzdWIiOiIyb2Z5THlxZXRhSFpCMnBta2RYZm1icUNMelQ1QkpFTFZOMiIsImNsYWltIjp7IlVuaXF1ZW5lc3MiOiJJcyBVbmlxdWUgLyBIYXNoIG9mIHRoZWlyIHBhc3Nwb3J0IG51bWJlciJ9LCJleHAiOjE1MzgxNTA3Mjc4ODIsImlzcyI6IjJvdHdrSnF2RzhtNWR0OVJldlFHaUhYR2gzTmV6MWk3S0RXIiwiaWF0IjoxNTA2NjE0NzI3ODgyfQ._XC-zNLpVrLC5T8nwWI9Xou4qHNR9GXtB252nCW5VgFORAuBVx2jZzuwkG-7uF_f3px1gkAO2vGWPM8EDdAxvQ")
            .then(() => {
              console.log("Bee Token Claim tx has been mined (doesn't necessarily mean it has given the user a token though) lets check their balance.")
              return web3Bridge.getUsersAccounts()
            })
            .then(accounts => beeTokenBridge.getBeeTokenBalance(accounts[0]))
            .then(balance => console.log("Users BEE balance: " + balance))

        }}>Claim BEE Token
        </button>
      </div>
    )

    const OnlyGuestLinks = HiddenOnlyAuth(() =>
      <div>
        <p>Sign in with uPort to claim your BEE token</p>
        <LoginButtonContainer/>
      </div>
    )

    const AttestationLink = () =>
      <div>
        <br/>
        <button className="pure-button button-xlarge" onClick={() => {

          // Put 'address' from 'requestCredentials() response here, forgot how to grab the state...
          generateUniquenessAttestation("2ofyLyqetaHZB2pmkdXfmbqCLzT5BJELVN2")

        }}>
          Create Attestation for logged in user
        </button>
        <br/>
        Note that this would actually be granted to the user by a third party / KYC provider.
        <br/> This only needs to be done once for the app that's registered in this web app.
      </div>

    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1> Bee Faucet</h1>
            <OnlyGuestLinks/>
            <OnlyAuthLinks/>
            <AttestationLink/>
          </div>
        </div>
      </main>
    )
  }
}

export default BeeFaucet

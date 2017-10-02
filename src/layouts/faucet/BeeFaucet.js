import React from 'react'
import {HiddenOnlyAuth, VisibleOnlyAuth} from '../../util/wrappers.js'
import {beeTokenBridge} from "../../web3/dependencies";
import {generateUniquenessAttestation} from "../../web3/attestationBridge";
import {connect} from "react-redux"
import {updateBeeBalance, updateBeeClaimable} from "./faucetActions"

// UI Components
import LoginButtonContainer from '../../user/ui/loginbutton/LoginButtonContainer'
import * as Utils from "../../../utils/Utils";

const BeeFaucetInner = ({userData, beeToken, updateBeeBalance, updateBeeIsClaimable}) => {

  const OnlyAuthLinks = VisibleOnlyAuth(() =>
    <div>

      {beeToken.beeIsClaimable ?

        <button className="pure-button button-xlarge" onClick={() => {
          // We probably want a loading spinner to appear somewhere while we wait for the tx to be mined. It can be stopped once the promise returns.
          // Also we should have a field showing the users current balance of BEE and update it once we have successfully claimed from the BEE faucet.
          // We can get the balance with beeTokenBridge.getBeeTokenBalance([users address]).then(balance => do something with balance)
          // We can get the users public address with web3Bridge.getUsersAccounts().then(accounts => console.log(accounts[0])).
          // The first account in the returned array is the one that is used for everything unless specified otherwise.

          // Put the 'verified.0.claim.jwt' from the 'requestCredentials()' response in place of the long string. (You will have to log in again if the attestation was granted since originally logging in)
          const jwt = Utils.getJwtForAttestation(userData.verified, "Uniqueness")

          beeTokenBridge.claimBeeToken(jwt)
            .subscribe(() => {
                console.log("Bee Token Claim tx has been mined (doesn't necessarily mean it has given the user a token though) lets check their balance.")
                updateBeeBalance()
                updateBeeIsClaimable(jwt)
              }
            )

        }}>Claim BEE Token
        </button>

        : "Bee has been claimed"}

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

        console.log("Granting logged in user an attestation, note will error if the user is not logged in.")
        generateUniquenessAttestation(userData.address)

      }}>
        Create Attestation for logged in user
      </button>
      <br/>
      Note that this would actually be granted to the user by a third party / KYC provider.
      <br/> This only needs to be done once for the app that's registered in this web app.
      <br/>
      <br/>Once an attestation has been granted the user needs to refresh this screen and
      <br/>log back into their uPort account before they can claim a BEE token.
    </div>

  const BeeBalance = () =>
    <div>
      Bee Balance: {beeToken.beeBalance ? beeToken.beeBalance.toNumber() : "loading"}
    </div>

  return (
    <main className="container">
      <div className="pure-g">
        <div className="pure-u-1-1">
          <h1> Bee Faucet</h1>
          <OnlyGuestLinks/>
          <OnlyAuthLinks/>
          <BeeBalance/>
          <AttestationLink/>
        </div>
      </div>
    </main>
  )
}

const mapStateToProps = state => ({
  userData: state.user.data,
  beeToken: state.beeBalance
})

const mapDispatchToProps = dispatch => ({
  updateBeeBalance: () => {
    dispatch(updateBeeBalance())
  },
  updateBeeIsClaimable: (jwt) => {
    dispatch(updateBeeClaimable(jwt))
  }
})

const BeeFaucet = connect(mapStateToProps, mapDispatchToProps)(BeeFaucetInner)

export default BeeFaucet

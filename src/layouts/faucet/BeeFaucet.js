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

  // We probably want a loading spinner to appear somewhere while we wait for the tx to be mined. It can be stopped once the promise returns.
  // Put the 'verified.0.claim.jwt' from the 'requestCredentials()' response in place of the long string. (You will have to log in again if the attestation was granted since originally logging in)
  const claimBee = function () {
    const jwt = Utils.getJwtForAttestation(userData.verified, "Uniqueness")

    beeTokenBridge.claimBeeToken(jwt)
      .subscribe(() => {
          console.log("Bee Token Claim tx has been mined (doesn't necessarily mean it has given the user a token though) lets check their balance.")
          updateBeeBalance()
          updateBeeIsClaimable(jwt)
        }
      )
  }

  const OnlyAuthLinks = VisibleOnlyAuth(() =>
    <div>

      {userData.isUnique ?

        <div>

          {beeToken.beeIsClaimable ?

            <button className="pure-button button-xlarge" onClick={claimBee}> Claim BEE Token </button>

            :

            <div>
              <p>Bee has been claimed or your attestation is invalid.</p>
              <p>Bee Balance: {beeToken.beeBalance ? beeToken.beeBalance.toNumber() : "loading"} </p>
            </div>

          }

        </div>

        :

        <AttestationLink/>

      }

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
      <p>In order to cliam a BEE token you need to have an attestation that you are unique.</p>
      <p>Once you have received the attestation you must refresh this page and log back in again to be able to claim Bee.</p>
      <a href="http://attest.servesa.io">Get attestation</a>

      <button onClick={(() => generateUniquenessAttestation(userData.address))}>attest</button>
    </div>

  return (
    <main className="container">
      <div className="pure-g">
        <div className="pure-u-1-1">
          <h1> Bee Faucet</h1>
          <OnlyGuestLinks/>
          <OnlyAuthLinks/>
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

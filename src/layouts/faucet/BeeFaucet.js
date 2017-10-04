import React from 'react'
import {HiddenOnlyAuth, VisibleOnlyAuth} from '../../util/wrappers.js'
import {beeTokenBridge} from "../../web3/dependencies";
import {generateUniquenessAttestation} from "../../web3/attestationBridge";
import {connect} from "react-redux"
import {updateBeeBalance, updateBeeClaimable} from "./faucetActions"

// UI Components
import LoginButtonContainer from '../../user/ui/loginbutton/LoginButtonContainer'
import * as Utils from "../../../utils/Utils";


// Images
import linkOutSVG from '../../img/linkout.svg'
import checkmark from '../../img/checkmark.svg'
import xmark from '../../img/X_mark.svg'

const BeeFaucetInner = ({userData, beeToken, updateBeeBalance, updateBeeIsClaimable}) => {

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

  const BeeFaucetGuest = HiddenOnlyAuth(() =>
    <button
      disabled
      className="pure-button pure-button-primary"
      onClick={claimBee}> Claim BEE Token
    </button>
  )

  const BeeFaucetAuth = VisibleOnlyAuth(() =>
    <div>

      {userData.isUnique && beeToken.beeIsClaimable ?

        <button
          className="pure-button pure-button-primary"
          onClick={claimBee}> Claim BEE Token
        </button>

      :

        <div>
          {beeToken.beeBalance > 0 ?

            <div>
              <p>Congrats! You have claimed your BEE token!</p>
              <p>Bee Balance: {beeToken.beeBalance ? beeToken.beeBalance.toNumber() : "loading"} </p>
            </div>

            :

            <p>BEE token is unavailable, not sure why :/</p>
          }
        </div>

      }

    </div>
  )

  const UPortGuest = HiddenOnlyAuth(() =>
    <div>
      <LoginButtonContainer/>
    </div>
  )
  const UPortAuth = VisibleOnlyAuth(() =>
    <div>

      {!userData.isUnique ?

        <div>
          <p>You must have an approved uniqueness attestor service add an attestation to your uPort profile that certifies that you are unique. Then return here to claim your BEE token.</p>
            <a className='pure-button attest-app'
              href="http://attest.servesa.io"
              target='_blank'
              rel='noopener norefferer'>
                Get attestation
                <img className='button-icon button-icon-left' src={linkOutSVG}></img>
            </a>
        </div>
        :
        null
      }

    </div>
  )

  const GetAttestationLink = () =>
    <div>
      <p>In order to cliam a BEE token you need to have an attestation that you are unique.</p>
      <p>Once you have received the attestation you must refresh this page and log back in again to be able to claim Bee.</p>
      <a href="http://attest.servesa.io">Get attestation</a>

      <button className='pure-button' onClick={(() => generateUniquenessAttestation(userData.address))}>attest</button>
    </div>

  return (
    <main className="container">
      <div className="pure-g">
        <div className="pure-u-1 pure-u-md-1-4">
        </div>
        <div className="pure-u-1 pure-u-md-1-2">

          <h1> BEE Token Faucet</h1>
          <p>BEE tokens ensure that HNY tokens are being distributed evenly – one BEE token is issued to each person. Use your BEE token to claim HNY tokens each month.</p>

          <hr></hr>

          <h2>Before you begin</h2>
          <p>You must have an approved uniqueness attestor service add an attestation to your uPort profile that certifies that you are unique. Then return here to claim your BEE token.</p>
          <div className=''>
            <a className='pure-button pure-button-primary'
              href="http://attest.servesa.io"
              target='_blank'
              rel='noopener norefferer'>
                Get attestation
                <img className='button-icon button-icon-left' src={linkOutSVG}></img>
            </a>
          </div>
          <br></br>
          <hr></hr>

          <h2>Claim your BEE token</h2>
          <UPortGuest/>
          <UPortAuth/>

          <BeeFaucetAuth/>


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

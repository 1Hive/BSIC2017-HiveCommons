import React from 'react'
import {honeyTokenBridge} from '../../web3/dependencies.js'
import {
  updateBeeAvailableForClaiming, updateHoneyBalance, updateHoneyFaucetExpired,
  updateHoneyToBeeRate
} from "./faucetActions";
import {connect} from "react-redux";

const HoneyFaucetInner = ({honey, updateHoneyBalance, updateHoneyToBeeRate, updateBeeClaimableForHoney, updateHoneyFaucetExpired}) => {

  const OnlyGuestLinks = () =>
    <div>
      {honey.beeAvailableForClaiming === 0 ?

        <p>No Bee available for claiming Honey in this faucet period (or faucet hasn't been created yet)</p> :

        <button className="pure-button button-xlarge" onClick={() =>

          honeyTokenBridge.claimHoney().subscribe(() => {
            console.log("Honey sent to sending users account")
            updateHoneyBalance()
            updateBeeClaimableForHoney()
          })
        }>
          Claim Honey
        </button>
      }
    </div>

  const HoneyBalance = () =>
    <div>
      Honey Balance: {honey.honeyBalance === null ? "loading" : honey.honeyBalance}
    </div>

  const BeeAvailable = () =>
    <div>
      Bee Available for Claiming in this
      faucet period: {honey.beeAvailableForClaiming === null ? "loading" : honey.beeAvailableForClaiming}
    </div>

  const CreateFaucet = () =>
    <div>
      {honey.honeyFaucetExpired ?

        <div>
          <button className="pure-button button-xlarge" onClick={() => {

            honeyTokenBridge.createFaucet().subscribe(tx => {
              console.log("Honey faucet has been created")
              updateHoneyToBeeRate()
              updateBeeClaimableForHoney()
              updateHoneyFaucetExpired()
            })

          }}>
            Create Faucet
          </button>
          <br/>
          It should not be called until everyone has claimed their BEE tokens.
          <br/>
          BEE tokens claimed after faucet creation cannot claim from that faucet.
        </div>

        :

        <div>
          Faucet has been created.
        </div>

      }
    </div>

  return (
    <main className="container">
      <div className="pure-g">
        <div className="pure-u-1-1">
          <h1> HNY Faucet </h1>
          <p>Convert BEE tokens to HNY tokens
            at {honey.honeyToBeeRate ? honey.honeyToBeeRate : "[loading (or faucet hasn't been created yet)]"}
            Honey for 1 Bee</p>
          <OnlyGuestLinks/>
          <HoneyBalance/>
          <BeeAvailable/>
          <br/>
          <CreateFaucet/>
        </div>
      </div>
    </main>
  )
}

const mapStateToProps = state => ({
  honey: state.honey
})

const mapDispatchToProps = dispatch => ({
  updateHoneyBalance: () => {
    dispatch(updateHoneyBalance())
  },
  updateHoneyToBeeRate: () => {
    dispatch(updateHoneyToBeeRate())
  },
  updateBeeClaimableForHoney: () => {
    dispatch(updateBeeAvailableForClaiming())
  },
  updateHoneyFaucetExpired: () => {
    dispatch(updateHoneyFaucetExpired())
  }
})

const HoneyFaucet = connect(mapStateToProps, mapDispatchToProps)(HoneyFaucetInner)

export default HoneyFaucet

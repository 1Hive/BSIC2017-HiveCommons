import React from 'react'
import ProgressButton from 'react-progress-button'

import {honeyTokenBridge} from '../../web3/dependencies.js'
import {
  updateBeeAvailableForClaiming, updatedHoneyClaimLoading, updatedHoneyCreateFaucetLoading,
  updateHoneyBalance,
  updateHoneyFaucetExpired,
  updateHoneyToBeeRate
} from "./faucetActions";
import {connect} from "react-redux";
import "./Faucet.css"


const HoneyFaucetInner = ({honey, bee, updateHoneyBalance, updateHoneyToBeeRate, updateBeeClaimableForHoney, updateHoneyFaucetExpired, updateHoneyClaimLoading, updateHoneyCreateFaucetLoading}) => {

  const claimHoney = () => {
    updateHoneyClaimLoading(true)
    honeyTokenBridge.claimHoney().subscribe(() => {
      console.log("Honey sent to sending users account")
      updateHoneyBalance()
      updateBeeClaimableForHoney()
      updateHoneyClaimLoading(false)
    })
  }


  const CreateFaucet = () =>
    <div>
      <div>
        <button className="pure-button pure-button-primary" onClick={() => {
          updateHoneyCreateFaucetLoading(true)
          honeyTokenBridge.createFaucet().subscribe(tx => {
            console.log("Honey faucet has been created")
            updateHoneyToBeeRate()
            updateBeeClaimableForHoney()
            updateHoneyFaucetExpired()
            updateHoneyCreateFaucetLoading(false)
          })

        }}>
          Create Faucet
        </button>

        {honey.honeyCreateFaucetLoading ?
          <div className="loader"/>
          : null}

        <p>Bee tokens claimed after faucet creation cannot claim from that faucet.</p>
        <p>In reality, the first Honey faucet would be created one month after the Bee faucet to ensure there had been a
          chance for people to claim Bee.</p>
        <p>For demo purposes we should not call this until all testers have claimed their Bee tokens.</p>
      </div>
    </div>

  const HoneyTable = () =>
    <div>
      <h2>Claim HNY Tokens</h2>
      <table className="pure-table pure-table-bordered">
        <tbody>
        <tr>
          <td className="text-cell">Total BEE Token Balance:</td>
          <td className="number-cell">{bee.beeBalance === null ? "loading" : bee.beeBalance.toNumber()}</td>
        </tr>
        <tr>
          <td className="text-cell">Eligible BEE Token Balance:</td>
          <td
            className="number-cell">{honey.beeAvailableForClaiming === null ? "loading" : honey.beeAvailableForClaiming}</td>
        </tr>
        <tr>
          <td className="text-cell">
            <em>Conversion Rate: 1 BEE = {honey.honeyToBeeRate ? honey.honeyToBeeRate : "loading"}&nbsp;HNY</em>
          </td>
          <td className="number-cell">
            <button
              className="pure-button pure-button-primary"
              onClick={claimHoney}
              disabled={!honey.beeAvailableForClaiming}
            > Claim HNY
            </button>

            {honey.honeyClaimLoading ?
              <div className="loader"/>
              : null}

          </td>
        </tr>
        <tr>
          <td className="text-cell">Your current HNY Balance:</td>
          <td className="number-cell">{honey.honeyBalance === null ? "loading" : honey.honeyBalance}</td>
        </tr>
        </tbody>
      </table>
    </div>

  return (
    <main className="container">
      <div className="pure-g">
        <div className="pure-u-1-1">
          <h1> HNY Faucet </h1>
          <p>Use your BEE Token to claim HNY Tokens. HNY tokens are used to participate in HiveCommons governance.</p>
          <hr></hr>

          <div className="pure-g">
            <div className="pure-u-1-4"></div>
            <div className="pure-u-1-2">

              {honey.honeyFaucetExpired ?
                <CreateFaucet/>
                :
                <HoneyTable/>
              }

            </div>
            <div className="pure-u-1-4"></div>
          </div>

        </div>
      </div>
    </main>
  )
}

const mapStateToProps = state => ({
  honey: state.honey,
  bee: state.bee
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
  },
  updateHoneyClaimLoading: (honeyClaimLoading) => {
    dispatch(updatedHoneyClaimLoading(honeyClaimLoading))
  },
  updateHoneyCreateFaucetLoading: (createFaucetLoading) => {
    dispatch(updatedHoneyCreateFaucetLoading(createFaucetLoading))
  }
})

const HoneyFaucet = connect(mapStateToProps, mapDispatchToProps)(HoneyFaucetInner)

export default HoneyFaucet

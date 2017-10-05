import React from 'react'
import {honeyTokenBridge} from '../../web3/dependencies.js'
import {
  updateBeeAvailableForClaiming,
  updateHoneyBalance,
  updateHoneyFaucetExpired,
  updateHoneyToBeeRate
} from "./faucetActions";
import {connect} from "react-redux";




const HoneyFaucetInner = ({honey, bee, updateHoneyBalance, updateHoneyToBeeRate, updateBeeClaimableForHoney, updateHoneyFaucetExpired}) => {

  const claimHoney = () =>
    honeyTokenBridge.claimHoney().subscribe(() => {
      console.log("Honey sent to sending users account")
      updateHoneyBalance()
      updateBeeClaimableForHoney()
    })

  //
  // const ClaimHoney = () =>
  //   <div>
  //     {honey.beeAvailableForClaiming === 0 ?
  //
  //       <p>No Bee available for claiming Honey in this faucet period.</p>
  //
  //     :
  //
  //       <div>
  //         <p>
  //           <strong>Conversion Rate:</strong> 1 BEE = {honey.honeyToBeeRate ? honey.honeyToBeeRate : "loading"}&nbsp;HNY
  //         </p>
  //         <button
  //           className="pure-button button-xlarge"
  //           onClick={claimHoney}>
  //             Claim Honey
  //         </button>
  //       </div>
  //
  //     }
  //
  //   </div>

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
            <td className="number-cell">{honey.beeAvailableForClaiming === null ? "loading" : honey.beeAvailableForClaiming}</td>
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
            </td>
          </tr>
          <tr>
            <td className="text-cell">Your current HNY Balance:</td>
            <td className="number-cell">{honey.honeyBalance === null ? "loading" : honey.honeyBalance}</td>
          </tr>
        </tbody>
      </table>
    </div>

  const CreateFaucet = () =>
    <div>
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
  }
})

const HoneyFaucet = connect(mapStateToProps, mapDispatchToProps)(HoneyFaucetInner)

export default HoneyFaucet

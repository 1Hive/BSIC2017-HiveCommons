import React from 'react'
import {honeyTokenBridge} from '../../web3/dependencies.js'
import {updateBeeAvailableForClaiming, updateHoneyBalance, updateHoneyToBeeRate} from "./faucetActions";
import {connect} from "react-redux";

const HoneyFaucetInner = ({honeyToken, updateHoneyBalance, updateHoneyToBeeRate, updateBeeClaimableForHoney}) => {

    const OnlyGuestLinks = () =>
        <div>
            <button className="pure-button button-xlarge" onClick={() =>

                honeyTokenBridge.claimHoney().subscribe(() => {
                    console.log("Honey sent to sending users account")
                    updateHoneyBalance()
                    updateBeeClaimableForHoney()
                })
            }>
                Claim Honey
            </button>
        </div>

    const HoneyBalance = () =>
        <div>
            Honey Balance: {honeyToken.honeyBalance ? honeyToken.honeyBalance : "loading"}
        </div>

    const BeeAvailable = () =>
        <div>
            Bee Available for Claiming in this
            faucet: {honeyToken.beeAvailableForClaiming === null ? "loading" : honeyToken.beeAvailableForClaiming}
        </div>

    const CreateFaucet = () =>
        <div>
            <button className="pure-button button-xlarge" onClick={() => {

                honeyTokenBridge.createFaucet().subscribe(tx => {
                    console.log("Honey faucet has been created")
                    updateHoneyToBeeRate()
                    updateBeeClaimableForHoney()
                })

            }}>
                Create Faucet
            </button>
            <br/>
            In reality this would only appear if the faucet hasn't been created yet.
            <br/>
            It should not be called until everyone has claimed their BEE tokens.
            <br/>
            BEE tokens claimed after faucet creation cannot claim from that faucet.
        </div>

    return (
        <main className="container">
            <div className="pure-g">
                <div className="pure-u-1-1">
                    <h1> HNY Faucet </h1>
                    <p>Convert BEE tokens to HNY tokens
                        at {honeyToken.honeyToBeeRate ? honeyToken.honeyToBeeRate : "[loading]"} Honey for 1 Bee</p>
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
    honeyToken: state.honeyBalance
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
    }
})

const HoneyFaucet = connect(mapStateToProps, mapDispatchToProps)(HoneyFaucetInner)

export default HoneyFaucet

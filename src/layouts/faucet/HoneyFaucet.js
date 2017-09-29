import React from 'react'
import {honeyTokenBridge} from '../../web3/dependencies.js'
import {updateHoneyBalance} from "./balanceActions";
import {connect} from "react-redux";

const HoneyFaucetInner = ({honeyBalance, updateHoneyBalance}) => {

    const OnlyGuestLinks = () =>
        <div>
            <button className="pure-button button-xlarge" onClick={() =>

                honeyTokenBridge.claimHoney().subscribe(() => {
                    console.log("Honey sent to sending users account")
                    updateHoneyBalance()
                })
            }>
                Claim Honey
            </button>
        </div>

    const HoneyBalance = () =>
        <div>
            Honey Balance: {honeyBalance.honeyBalance ? honeyBalance.honeyBalance : "loading"}
        </div>

    const CreateFaucet = () =>
        <div>
            <button className="pure-button button-xlarge" onClick={() => {

                honeyTokenBridge.createFaucet().subscribe(tx => console.log("Honey faucet has been created"))

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
                    <p>Convert BEE tokens to HNY tokens</p>
                    <OnlyGuestLinks/>
                    <HoneyBalance/>
                    <br/>
                    <CreateFaucet/>
                </div>
            </div>
        </main>
    )
}

const mapStateToProps = state => ({
    honeyBalance: state.honeyBalance
})

const mapDispatchToProps = dispatch => ({
    updateHoneyBalance: () => {
        dispatch(updateHoneyBalance())
    }
})

const HoneyFaucet = connect(mapStateToProps, mapDispatchToProps)(HoneyFaucetInner)

export default HoneyFaucet

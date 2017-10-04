import Contract from "truffle-contract"
import HoneyToken from "../../../build/contracts/HoneyToken.json"
import HoneyFaucet from "../../../build/contracts/HoneyFaucet.json"
import MiniMeToken from "../../../build/contracts/MiniMeToken.json"
import * as Rx from "rxjs";

export default class HoneyTokenBridge {

    constructor(web3, web3Bridge) {
        const honeyToken = Contract(HoneyToken)
        honeyToken.setProvider(web3.currentProvider)
        this.honeyToken$ = Rx.Observable
            .fromPromise(honeyToken.deployed())
            .shareReplay(1)

        const honeyFaucet = Contract(HoneyFaucet)
        honeyFaucet.setProvider(web3.currentProvider)
        this.honeyFaucet$ = Rx.Observable
            .fromPromise(honeyFaucet.deployed())
            .shareReplay(1)

        const uninstantiatedBeeToken = Contract(MiniMeToken)
        uninstantiatedBeeToken.setProvider(web3.currentProvider)
        this.uninstantiatedBeeToken = uninstantiatedBeeToken

        this.web3Bridge = web3Bridge
    }

    canClaimHoney() {
        return this.honeyFaucet$
            .flatMap(honeyFaucet => honeyFaucet.hasBeeInClone())
    }

    beeAvailableInClone() {
        return this.honeyFaucet$
            .flatMap(honeyFaucet => honeyFaucet.getBeeTokenCloneAddress())
            .zip(this.web3Bridge.getCoinbase$(), (beeTokenCloneAddress, coinbaseAddress) => ({beeTokenCloneAddress, coinbaseAddress}))
            .flatMap(zipResult => {
                const beeToken = this.uninstantiatedBeeToken.at(zipResult.beeTokenCloneAddress)
                return beeToken.balanceOf(zipResult.coinbaseAddress)
            })
            .map(balance => balance.toNumber())
    }

    getHoneyForBeeRate() {
        return this.honeyFaucet$
            .flatMap(honeyFaucet => honeyFaucet.honeyForBeeRate())
            .map(honeyToBeeRate => honeyToBeeRate / 10 ** 18)
    }

    getBalance() {
        return this.honeyToken$
            .zip(this.web3Bridge.getCoinbase$(), (honeyToken, coinbaseAddress) => ({honeyToken, coinbaseAddress}))
            .flatMap(zipResult => zipResult.honeyToken.balanceOf(zipResult.coinbaseAddress))
            .map(balance => balance / 10 ** 18)
    }

    createFaucet() {
        return this.honeyFaucet$
            .zip(this.web3Bridge.getCoinbase$(), (honeyFaucet, coinbaseAddress) => ({honeyFaucet, coinbaseAddress}))
            .flatMap(zipResult => zipResult.honeyFaucet.createFaucet({from: zipResult.coinbaseAddress, gas: 2000000}))
    }

    isFaucetExpired() {
        return this.honeyFaucet$
            .flatMap(honeyFaucet => honeyFaucet.currentFaucetExpired())
    }

    claimHoney() {
        return this.honeyFaucet$
            .zip(this.web3Bridge.getCoinbase$(), (honeyFaucet, coinbaseAddress) => ({honeyFaucet, coinbaseAddress}))
            .flatMap(zipResult => zipResult.honeyFaucet.claimHoney({from: zipResult.coinbaseAddress, gas: 2000000}))
    }
}
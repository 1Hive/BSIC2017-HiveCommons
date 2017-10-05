import Contract from "truffle-contract"
import BeeFaucet from "../../../build/contracts/BeeFaucet.json"
import MiniMeToken from "../../../build/contracts/MiniMeToken.json"
import {formatJwt} from "../../utils/ValidationUtils.js"
import * as Rx from "rxjs";

export default class BeeTokenBridge {

    constructor(web3, web3Bridge) {
        const beeFaucet = Contract(BeeFaucet)
        beeFaucet.setProvider(web3.currentProvider)
        const beeToken = Contract(MiniMeToken)
        beeToken.setProvider(web3.currentProvider)

        this.beeFaucet$ = Rx.Observable
            .fromPromise(beeFaucet.deployed())
            .shareReplay(1)

        this.beeToken$ = this.beeFaucet$
            .flatMap(_beeFaucet => _beeFaucet.getBeeTokenAddress())
            .map(beeTokenAddress => beeToken.at(beeTokenAddress))
            .shareReplay(1)

        this.web3Bridge = web3Bridge
    }

    canClaimBee(jwt) {
        const formattedJwt = formatJwt(jwt)
        return this.claimBeeVValue(formattedJwt)
            .map(anything => true)
            .defaultIfEmpty(false)
    }

    canClaimBeeWithV(formattedJwt, v) {
        return this.beeFaucet$
            .flatMap(beeFaucet => beeFaucet.canClaimBee(formattedJwt.sha256jwtMessagePart, v, formattedJwt.jwtSigRHex, formattedJwt.jwtSigSHex))
            .filter(canClaim => canClaim)
            .map(canClaim => v)
    }

    claimBeeVValue(formattedJwt) {
        return this.canClaimBeeWithV(formattedJwt, 27)
            .merge(this.canClaimBeeWithV(formattedJwt, 28))
    }

    claimBeeToken(jwt) {
        const formattedJwt = formatJwt(jwt)
        return Rx.Observable.zip(this.beeFaucet$, this.claimBeeVValue(formattedJwt), this.web3Bridge.getCoinbase$(),
            (beeFaucet, vValue, coinbaseAddress) => ({beeFaucet, vValue, coinbaseAddress}))
            .flatMap(zipResult => zipResult.beeFaucet.claimBee(formattedJwt.sha256jwtMessagePart, zipResult.vValue, formattedJwt.jwtSigRHex, formattedJwt.jwtSigSHex,
                {from: zipResult.coinbaseAddress, gas: 2000000}))
    }

    isFaucetExpired() {
        return this.beeFaucet$
            .flatMap(beeFaucet => beeFaucet.currentFaucetExpired())
    }

    getBeeTokenBalance() {
        return this.web3Bridge.getCoinbase$()
            .zip(this.beeToken$, (coinbaseAddress, beeToken) => ({coinbaseAddress, beeToken}))
            .flatMap(zipResult => zipResult.beeToken.balanceOf(zipResult.coinbaseAddress))
    }
}

import Contract from "truffle-contract"
import BeeFaucet from "../../../build/contracts/BeeFaucet.json"
import MiniMeToken from "../../../build/contracts/MiniMeToken.json"
import {formatJwt} from "../../utils/ValidationUtils.js"
import * as Rx from "rxjs";

export default class BeeTokenBridge {

    constructor(web3) {
        const beeFaucet = Contract(BeeFaucet)
        beeFaucet.setProvider(web3.currentProvider)
        const beeToken = Contract(MiniMeToken)
        beeToken.setProvider(web3.currentProvider)

        this.beeFaucet$ = Rx.Observable
            .fromPromise(beeFaucet.deployed())
            .shareReplay(1)

        this.beeToken$ = this.beeFaucet$
            .flatMap(_beeFaucet => _beeFaucet.getBeeTokenAddress())
            .flatMap(beeTokenAddress => beeToken.at(beeTokenAddress))
            .shareReplay(1)

        this.web3 = web3
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
        return this.claimBeeVValue(formattedJwt)
              .flatMap(signatureVValue => this.beeFaucet$
                  .flatMap(beeFaucet => beeFaucet.claimBee(formattedJwt.sha256jwtMessagePart, signatureVValue, formattedJwt.jwtSigRHex, formattedJwt.jwtSigSHex,
                      {from: this.web3.eth.coinbase, gas: 2000000})))
    }

    getBeeTokenBalance() {
        return this.beeToken$
            .flatMap(beeToken => beeToken.balanceOf(this.web3.eth.coinbase));
    }
}

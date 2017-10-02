import Contract from "truffle-contract"
import HoneyToken from "../../../build/contracts/HoneyToken.json"
import HoneyFaucet from "../../../build/contracts/HoneyFaucet.json"
import MiniMeToken from "../../../build/contracts/MiniMeToken.json"
import * as Rx from "rxjs";

export default class HoneyTokenBridge {

    constructor(web3) {
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

        this.web3 = web3
    }

    canClaimHoney() {
        return this.honeyFaucet$
            .flatMap(honeyToken => honeyToken.hasBeeInClone())
    }

    beeAvailableInClone() {
        return this.honeyFaucet$
            .flatMap(honeyFaucet => honeyFaucet.getBeeTokenCloneAddress())
            .flatMap(beeTokenCloneAddress => {
                const beeToken = Contract(MiniMeToken)
                beeToken.setProvider(this.web3.currentProvider)
                const beeTokenInst = beeToken.at(beeTokenCloneAddress)
                return beeTokenInst.balanceOf(this.web3.eth.coinbase)
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
            .flatMap(honeyToken => honeyToken.balanceOf(this.web3.eth.coinbase))
            .map(balance => balance / 10 ** 18)
    }

    createFaucet() {
        return this.honeyFaucet$
            .flatMap(honeyFaucet => honeyFaucet.createFaucet({from: this.web3.eth.coinbase, gas: 2000000}))
    }

    claimHoney() {
        return this.honeyFaucet$
            .flatMap(honeyFaucet => honeyFaucet.claimHoney({from: this.web3.eth.coinbase, gas: 2000000}))
    }
}
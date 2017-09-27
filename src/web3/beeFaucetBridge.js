import {web3} from "../util/connectors.js"
import {getWeb3} from "./getWeb3.js"
import Contract from "truffle-contract"
import BeeFaucet from "../../build/contracts/BeeFaucet.json"
import MiniMeToken from "../../build/contracts/MiniMeToken.json"
import {format as jwtFormat} from "../../utils/JwtFormatter.js"

export class BeeFaucetBridge {

    constructor(web3) {
        const beeFaucet = Contract(BeeFaucet)
        beeFaucet.setProvider(web3.currentProvider)
        const beeToken = Contract(MiniMeToken)
        beeToken.setProvider(web3.currentProvider)

        beeFaucet.deployed()
            .then(_beeFaucet => {
                this.beeFaucet = _beeFaucet
                return _beeFaucet.getBeeTokenAddress()
            })
            .then(beeTokenAddress => this.beeToken = beeToken.at(beeTokenAddress))

        this.web3 = web3
    }

    claimBeeToken(jwt) {
        const formattedJwt = jwtFormat(jwt)
        return this.beeFaucet.claimBee(formattedJwt.sha256jwtMessagePart, 27, formattedJwt.jwtSigRHex, formattedJwt.jwtSigSHex,
            {from: this.web3.eth.coinbase, gas: 2000000})
    }

    getBeeTokenBalance(address) {
        return this.beeToken.balanceOf(address)
    }
}
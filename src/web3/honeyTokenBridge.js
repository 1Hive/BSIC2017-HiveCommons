import Contract from "truffle-contract"
import HoneyToken from "../../build/contracts/HoneyToken.json"
import HoneyFaucet from "../../build/contracts/HoneyFaucet.json"

export default class HoneyTokenBridge {

    constructor(web3) {
        const honeyToken = Contract(HoneyToken)
        honeyToken.setProvider(web3.currentProvider)
        honeyToken.deployed().then(_honeyToken => this.honeyToken = _honeyToken)

        const honeyFaucet = Contract(HoneyFaucet)
        honeyFaucet.setProvider(web3.currentProvider)
        honeyFaucet.deployed().then(_honeyFaucet => this.honeyFaucet = _honeyFaucet)

        this.web3 = web3
    }

    // Note, these all return promises. The ones that create Ethereum transactions (createFaucet
    // and claimHoney) return (call their callbacks) once the transaction has mined on the blockchain.
    getBalance() {
        return this.honeyToken.balanceOf(web3.eth.coinbase)
    }

    createFaucet() {
        return this.honeyFaucet.createFaucet({from: this.web3.eth.coinbase, gas: 2000000})
    }

    claimHoney() {
        return this.honeyFaucet.claimHoney({from: this.web3.eth.coinbase, gas: 2000000})
    }
}
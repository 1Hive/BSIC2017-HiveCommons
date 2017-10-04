import {convertToPromise} from "../utils/Utils.js"

export default class Web3Bridge {

    constructor(web3) {
        this.web3 = web3
    }

    getUsersAccounts() {
        return convertToPromise(this.web3.eth.getAccounts)
    }
}

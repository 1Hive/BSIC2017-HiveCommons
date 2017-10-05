import {convertToPromise} from "../utils/Utils.js"
import * as Rx from "rxjs";

export default class Web3Bridge {

    constructor(web3) {
        this.web3 = web3
    }

    getCoinbase$() {
        return Rx.Observable
            .fromPromise(convertToPromise(this.web3.eth.getCoinbase))
    }
}

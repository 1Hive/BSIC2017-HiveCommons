import {Web3Bridge} from "./web3Bridge.js"
import {BeeFaucetBridge} from "./beeFaucetBridge";

export let beeFaucetBridge, web3Bridge

export const createDependencies = web3 => {
    web3Bridge = new Web3Bridge(web3)
    beeFaucetBridge = new BeeFaucetBridge(web3)
}
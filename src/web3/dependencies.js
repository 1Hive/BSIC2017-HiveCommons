import Web3Bridge from "./web3Bridge.js"
import BeeTokenBridge from "./contracts/beeTokenBridge";
import HoneyTokenBridge from "./contracts/honeyTokenBridge";

export let web3Bridge, beeTokenBridge, honeyTokenBridge

export const createDependencies = web3 => {
    web3Bridge = new Web3Bridge(web3)

    beeTokenBridge = new BeeTokenBridge(web3, web3Bridge)
    honeyTokenBridge = new HoneyTokenBridge(web3, web3Bridge)
}
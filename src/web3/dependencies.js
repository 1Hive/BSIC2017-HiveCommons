import {BeeFaucetBridge} from "./beeFaucetBridge";

export let beeFaucetBridge

export const createDependencies = web3 => {
    beeFaucetBridge = new BeeFaucetBridge(web3)
}
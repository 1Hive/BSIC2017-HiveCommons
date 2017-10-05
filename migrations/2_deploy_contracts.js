const MiniMeTokenFactory = artifacts.require("MiniMeTokenFactory.sol")
const BeeFaucet = artifacts.require("BeeFaucet.sol")
const HoneyToken = artifacts.require("HoneyToken.sol")
const HoneyFaucet = artifacts.require("HoneyFaucet.sol")
const addressFromPublicKey = require("../src/utils/ValidationUtils.js").addressFromPublicKey

const uPortAppPublicKey = "0x04f5188765f769dd4cf0b1cbcb93afe9ed3eab6820cbc34b9aba78bb7b8a66026dc3a08acac3a32a35815c8eee69a417fae26c56172217963dc14fd5a63c6987e4"
const uPortAppAccountAddress = addressFromPublicKey(web3, uPortAppPublicKey)

module.exports = deployer => {
    deployer.deploy(MiniMeTokenFactory)
        .then(() => deployer.deploy(BeeFaucet, MiniMeTokenFactory.address, uPortAppAccountAddress))
        .then(() => deployer.deploy(HoneyToken))
        .then(() => deployer.deploy(HoneyFaucet, HoneyToken.address, BeeFaucet.address))
        // Emulate initial token distribution and transfer ownership to HoneyFaucet.
        .then(() => HoneyToken.deployed())
        .then(honeyToken => {
            honeyToken.mint(web3.eth.accounts[0], 10 ** 26) // 10^18(token decimal places)+8(multiplier of tokens) = 100000000 initial tokens
                .then(() => honeyToken.transferOwnership(HoneyFaucet.address))
        })
}
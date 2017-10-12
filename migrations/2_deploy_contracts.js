const MiniMeTokenFactory = artifacts.require("MiniMeTokenFactory.sol")
const BeeFaucet = artifacts.require("BeeFaucet.sol")
const HoneyToken = artifacts.require("HoneyToken.sol")
const HoneyFaucet = artifacts.require("HoneyFaucet.sol")
const addressFromPublicKey = require("../src/utils/ValidationUtils.js").addressFromPublicKey

// const uPortAppPublicKey = "0x04f5188765f769dd4cf0b1cbcb93afe9ed3eab6820cbc34b9aba78bb7b8a66026dc3a08acac3a32a35815c8eee69a417fae26c56172217963dc14fd5a63c6987e4"
// New uPort attest app's public key.
const uPortAppPublicKey = "0x048be5b9c7b2ea14ffad30269ce16ed7a362aea2a31457825a25d1978ad8cd4c405001cb1909b4803a9e69f994ce8399c7ceec7b51a1df0e952dbf8a2f43d86011"
const uPortAppAccountAddress = addressFromPublicKey(web3, uPortAppPublicKey)

/**
 * Important! Block gas limit must be set to 5000000 if using testrpc eg 'testrpc --gasLimit 5000000'
 * The BeeFaucet requires ~ 4840000 gas to deploy, requires further investigation.
 */
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
const MiniMeTokenFactory = artifacts.require("MiniMeTokenFactory.sol")
const BeeFaucet = artifacts.require("BeeFaucet.sol")
const HoneyToken = artifacts.require("HoneyToken.sol")
const HoneyFaucet = artifacts.require("HoneyFaucet.sol")
const addressFromPublicKey = require("../utils/ValidationUtils.js").addressFromPublicKey

const uPortAppPublicKey = "0x04f5188765f769dd4cf0b1cbcb93afe9ed3eab6820cbc34b9aba78bb7b8a66026dc3a08acac3a32a35815c8eee69a417fae26c56172217963dc14fd5a63c6987e4"
const uPortAppAccountAddress = addressFromPublicKey(web3, uPortAppPublicKey)

module.exports = async (deployer) => {
    await deployer.deploy(MiniMeTokenFactory)
    await deployer.deploy(BeeFaucet, MiniMeTokenFactory.address, uPortAppAccountAddress)
    await deployer.deploy(HoneyToken)
    await deployer.deploy(HoneyFaucet, HoneyToken.address, BeeFaucet.address)
    await initDistributionAndTransferOwnership()
};

const initDistributionAndTransferOwnership = async () => {
    const honeyToken = await HoneyToken.deployed()
    await honeyToken.mint(web3.eth.accounts[0], 10 ** 26) // 10^18(token decimal places)+8(multiplier of tokens) = 100000000 initial tokens
    console.log("Successfully granted initial 100000000 tokens to account 0")
    await honeyToken.transferOwnership(HoneyFaucet.address)
    console.log("Transferred ownership/minting privilege of HoneyToken to HoneyFaucet")
}
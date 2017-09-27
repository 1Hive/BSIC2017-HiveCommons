const MiniMeTokenFactory = artifacts.require("MiniMeTokenFactory.sol")
const BeeFaucet = artifacts.require("BeeFaucet.sol")

const uPortAppPublicKey = "0x04f5188765f769dd4cf0b1cbcb93afe9ed3eab6820cbc34b9aba78bb7b8a66026dc3a08acac3a32a35815c8eee69a417fae26c56172217963dc14fd5a63c6987e4"

// Get rid of the 0x04, keccak256 the result and take the final 40 chars.
const formattedPublicKey = "0x" + web3.sha3(uPortAppPublicKey.slice(4), {encoding: 'hex'}).slice(-40)

module.exports = function (deployer) {
    deployer.deploy(MiniMeTokenFactory)
      .then(() => deployer.deploy(BeeFaucet, MiniMeTokenFactory.address, formattedPublicKey));
};

const BeeFaucet = artifacts.require("BeeFaucet.sol")

module.exports = function (deployer) {
    deployer.deploy(BeeFaucet);
};

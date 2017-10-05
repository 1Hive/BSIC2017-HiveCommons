pragma solidity ^0.4.15;

import "../FaucetPeriod.sol";
import "./HoneyToken.sol";
import "../bee/BeeFaucet.sol";
import "../bee/MiniMeToken.sol";

/**
 * @notice A faucet that can be reset once a month which enables claiming a proportional share of
 *         Honey tokens for each Bee token a user owns at the time of faucet creation.
 */
contract HoneyFaucet is FaucetPeriod {

    HoneyToken private honeyToken;
    BeeFaucet private beeFaucet;
    MiniMeToken private beeTokenClone;
    uint public honeyForBeeRate;

    /**
     * @notice Create the Honey Faucet contract and set the faucet period length.
     *         This does not initialise the faucet, to do that call createFaucet().
     * @param honeyTokenAddress Address of the HoneyToken contract
     * @param beeFaucetAddress Address of the BeeFaucet contract
     */
    function HoneyFaucet(address honeyTokenAddress, address beeFaucetAddress) {
        honeyToken = HoneyToken(honeyTokenAddress);
        beeFaucet = BeeFaucet(beeFaucetAddress);
        setFaucetPeriodLength(2628000); // 1 month in seconds
    }

    function getHoneyTokenAddress() public constant returns(address) {
        return address(honeyToken);
    }

    function getBeeTokenCloneAddress() public constant returns(address) {
        return address(beeTokenClone);
    }

    /**
     * @notice Overrides abstract setupFaucet() in FaucetPeriod.
     *         Creates a faucet for the distribution of Honey.
     *         Can be called once a month resetting individual's allowances.
     *         Will fail if no Bee tokens have been claimed yet. eg beeToken.totalSupply() == 0
     */
    function setupFaucet() internal {
        cloneBeeToken();
        setHoneyForBeeRate();
    }

    function cloneBeeToken() private {
        MiniMeToken beeToken = MiniMeToken(beeFaucet.getBeeTokenAddress());
        address beeTokenCloneAddress = beeToken.createCloneToken("Honey Faucet Bee Token Clone", 18, "BEC", 0, false);
        beeTokenClone = MiniMeToken(beeTokenCloneAddress);
    }

    function setHoneyForBeeRate() private {
        uint totalHoney = honeyToken.totalSupply();
        // This works out at more than 15% a year but keeping track of the year or doing more complex math is out of scope for now.
        uint yearlyIncrease = (totalHoney / 100) * 15; // 15% of current supply.
        uint currentFaucetTotalDistribution = yearlyIncrease / 12; // monthly increase, current faucet supply.
        uint currentFaucetTotalBee = beeTokenClone.totalSupply();

        honeyForBeeRate = currentFaucetTotalDistribution / currentFaucetTotalBee;
    }

    function hasBeeInClone() public constant returns (bool) {
        return beeTokenClone.balanceOf(msg.sender) > 0;
    }

    /**
     * @notice Allows the owner of one or more Bee tokens in the Bee clone to destroy them in return for Honey tokens.
     *         The owner must have had Bee in the calling account at the time createFaucet() is successfully executed.
     *         Honey tokens are granted to the sending accounts balance.
     *         Ownership/minting privilege of the HoneyToken must have been transferred to the HoneyFaucet contract after initial distribution.
     */
    function claimHoney() public {
        require(hasBeeInClone());
        uint sendersAccountBeeBalance = beeTokenClone.balanceOf(msg.sender);
        uint honeyAwarded = sendersAccountBeeBalance * honeyForBeeRate;
        beeTokenClone.destroyTokens(msg.sender, sendersAccountBeeBalance);
        honeyToken.mint(msg.sender, honeyAwarded);
    }
}

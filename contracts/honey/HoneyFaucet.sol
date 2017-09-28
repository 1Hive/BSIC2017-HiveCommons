pragma solidity ^0.4.15;

import "./HoneyToken.sol";
import "../bee/BeeFaucet.sol";
import "../bee/MiniMeToken.sol";

contract HoneyFaucet {

    HoneyToken private honeyToken;
    BeeFaucet private beeFaucet;
    MiniMeToken private beeTokenClone;
    uint public faucetEndTime;
    uint public honeyForBeeRate;

    function HoneyFaucet(address honeyTokenAddress, address beeFaucetAddress) {
        honeyToken = HoneyToken(honeyTokenAddress);
        beeFaucet = BeeFaucet(beeFaucetAddress);
    }

    modifier noCurrentFaucet() { require(now > faucetEndTime); _; }

    modifier hasBee() { require(beeTokenClone.balanceOf(msg.sender) > 0); _; }

    function getHoneyTokenAddress() public constant returns(address) {
        return address(honeyToken);
    }

    function getBeeTokenCloneAddress() public constant returns(address) {
        return address(beeTokenClone);
    }

    /**
     * @notice Creates a faucet for the distribution of Honey.
     *         Can be called once a month resetting individual's allowances.
     *         Will fail if no Bee tokens have been claimed yet. eg beeToken.totalSupply() == 0
     */
    function createFaucet() public noCurrentFaucet {
        // Should probably use block height but it's harder to test so we'll use block time for now.
        faucetEndTime = now + 2628000; // 1 month in seconds

        MiniMeToken beeToken = MiniMeToken(beeFaucet.getBeeTokenAddress());
        address beeTokenCloneAddress = beeToken.createCloneToken("Honey Faucet Bee Token Clone", 18, "BEC", 0, false);
        beeTokenClone = MiniMeToken(beeTokenCloneAddress);

        uint totalHoney = honeyToken.totalSupply();
        // Ultimately this works out at more than 15% a year but keeping track of the year or doing more complex math is out of scope for now.
        uint yearlyIncrease = (totalHoney / 100) * 15; // 15% of current supply.
        uint currentFaucetTotalDistribution = yearlyIncrease / 12; // monthly increase, current faucet supply.
        uint currentFaucetTotalBee = beeToken.totalSupply();

        honeyForBeeRate = currentFaucetTotalDistribution / currentFaucetTotalBee;
    }

    /**
     * @notice Allows the owner of one or more Bee tokens to destroy them in return for Honey tokens.
     *         The owner must have had Bee in the calling account at the time createFaucet() is successfully executed.
     *         Honey tokens are granted to the sending accounts balance.
     */
    function claimHoney() public hasBee {
        uint sendersAccountBeeBalance = beeTokenClone.balanceOf(msg.sender);
        uint honeyAwarded = sendersAccountBeeBalance * honeyForBeeRate;
        beeTokenClone.destroyTokens(msg.sender, sendersAccountBeeBalance);
        honeyToken.mint(msg.sender, honeyAwarded);
    }
}

pragma solidity ^0.4.15;

import "./HoneyToken.sol";
import "../bee/BeeFaucet.sol";
import "../bee/MiniMeToken.sol";

contract HoneyFaucet {

    HoneyToken private honeyToken;
    BeeFaucet private beeFaucet;
    // TODO: Consider using a struct for this stuff.
    MiniMeToken private beeTokenClone;
    uint public currentFaucetEndTime;

    function HoneyFaucet(address honeyTokenAddress, address beeFaucetAddress) {
        honeyToken = HoneyToken(honeyTokenAddress);
        beeFaucet = BeeFaucet(beeFaucetAddress);
        createFaucet();
    }

    modifier noCurrentFaucet() { require(now > currentFaucetEndTime); _; }

    function getHoneyTokenAddress() public constant returns(address) {
        return address(honeyToken);
    }

    function getBeeTokenCloneAddress() public constant returns(address) {
        return address(beeTokenClone);
    }

    function createFaucet() public noCurrentFaucet {
        // Should probably use block height but it's harder to test so we'll use block time for now.
        currentFaucetEndTime = now + 2628000; // 1 month in seconds

        MiniMeToken beeToken = MiniMeToken(beeFaucet.getBeeTokenAddress());
        address beeTokenCloneAddress = beeToken.createCloneToken("Honey Faucet Bee Token Clone", 18, "BEC", 0, false);
        beeTokenClone = MiniMeToken(beeTokenCloneAddress);
    }

    function claimHoney() {

    }
}

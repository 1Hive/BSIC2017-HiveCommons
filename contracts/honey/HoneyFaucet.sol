pragma solidity ^0.4.15;

import "../bee/BeeFaucet.sol";
import "../bee/MiniMeToken.sol";

contract HoneyFaucet {

    BeeFaucet private beeFaucet;
    // TODO: Consider using a struct for this stuff.
    MiniMeToken private currentFaucetBeeToken;
    uint public currentFaucetEndBlock;

    function HoneyFaucet(address beeFaucetAddress){
        beeFaucet = BeeFaucet(beeFaucetAddress);
    }

    modifier noCurrentFaucet() { require(block.number > currentFaucetEndBlock); _; }

    function createFaucet() noCurrentFaucet {
        // 1 month in seconds / 15 sec block time ~ 175000
        currentFaucetEndBlock = block.number + 175000;

        MiniMeToken beeToken = MiniMeToken(beeFaucet.getBeeTokenAddress());
        address beeTokenCloneAddress = beeToken.createCloneToken("Honey Faucet Bee Token Clone", 18, "BEC", 0, false);
        currentFaucetBeeToken = MiniMeToken(beeTokenCloneAddress);
    }

}

pragma solidity ^0.4.15;


contract FaucetPeriod {

    uint public faucetLength;
    uint public faucetEndTime;

    modifier currentFaucetExpired() { require(now > faucetEndTime); _; }

    function setFaucetPeriodLength(uint _periodLength) internal {
        faucetLength = _periodLength;
    }

    function createFaucet() public currentFaucetExpired {
        // Should probably use block height but it's harder to test so we'll use block time for now.
        faucetEndTime = now + faucetLength;
        setupFaucet();
    }

    function setupFaucet() internal;

}

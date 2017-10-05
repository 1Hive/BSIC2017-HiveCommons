pragma solidity ^0.4.15;

/**
 * @notice Abstract contract which represents a faucet period and restricts creation to the period specified.
 */
contract FaucetPeriod {

    uint public faucetLength;
    uint public faucetEndTime;

    /**
     * @notice Set the period length of the faucet.
     * @param _periodLength Period for which a faucet cannot be created since previous faucet.
     */
    function setFaucetPeriodLength(uint _periodLength) internal {
        faucetLength = _periodLength;
    }

    /**
     * @notice Checks if the current faucet has expired.
     * @return true if expired, false otherwise.
     */
    function currentFaucetExpired() public constant returns (bool) {
        return now > faucetEndTime;
    }

    /**
     * @notice Create the faucet specified in setupFaucet().
     *         Restricted by the specified faucet period length.
     */
    function createFaucet() public {
        require(currentFaucetExpired());
        // Should probably use block height but it's harder to test so we'll use block time for now.
        faucetEndTime = now + faucetLength;
        setupFaucet();
    }

    /**
     * @notice Abstract function that must be implemented by child contracts.
     *         Called by createFaucet() for Faucet specific setup.
     */
    function setupFaucet() internal;

}

pragma solidity ^0.4.15;

/**
 * @notice Abstract contract which represents a faucet period and restricts faucet creation to the period specified.
 */
contract FaucetPeriod {

    // TODO: Investigate use of smaller uint's or uint256.
    // I think converting 'now' to a uint64 outweighs the benefit of using smaller uint's
    uint64 public faucetLength;
    uint64 public faucetEndTime;

    /**
     * @notice Set the period length of the faucet.
     * @param _periodLength Period for which a faucet cannot be created since previous faucet.
     */
    function setFaucetPeriodLength(uint64 _periodLength) internal {
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
        require(currentFaucetExpired()); // Comment out to enable creation of faucets at anytime for testing purposes.
        faucetEndTime = uint64(now) + faucetLength;
        setupFaucet();
    }

    /**
     * @notice Abstract function that must be implemented by child contracts.
     *         Called by createFaucet() for Faucet specific setup.
     */
    function setupFaucet() internal;

}

pragma solidity ^0.4.15;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "../FaucetPeriod.sol";
import "./MiniMeToken.sol";

/**
 * @notice A faucet that can be reset once a year and enables the claiming of
 *         one Bee token for each unclaimed uniquely identifying attestation.
 *         TODO: Should be upgradable, probably with an approach similar to EtherRouter.
 */
contract BeeFaucet is Ownable, FaucetPeriod {

    MiniMeToken private beeToken;
    address private miniMeTokenFactoryAddress;
    address public attestationProviderPublicAddress;
    uint64 public faucetStartTime;
    mapping(bytes32 => uint64) public attestationClaimedTimes;

    event LogBeeClaimed(address receiver);

    /**
     * @notice Create the BeeFaucet contract and set the faucet period length.
     * @param _miniMeTokenFactoryAddress Address of the MiniMeTokenFactory contract
     * @param _appPublicAddress Public address of the uPort app used for verifying attestations granted by that app.
     */
    function BeeFaucet(address _miniMeTokenFactoryAddress, address _appPublicAddress) {
        miniMeTokenFactoryAddress = _miniMeTokenFactoryAddress;
        attestationProviderPublicAddress = _appPublicAddress;
        setFaucetPeriodLength(31540000); // ~ 1 year in seconds
        createFaucet();
    }

    function getBeeTokenAddress() public constant returns (address) {
        return address(beeToken);
    }

    /**
     * @notice Overrides abstract setupFaucet() in FaucetPeriod. Can be called through createFaucet().
     *         Creates a new Bee token which once claimed can be used to claim Honey.
     *         Can be called once a year resetting individual's allowances.
     */
    function setupFaucet() internal {
        beeToken = new MiniMeToken(miniMeTokenFactoryAddress, 0, 0, "Bee", 18, "BEE", true);
        faucetStartTime = uint64(now);
    }

    /**
     * @notice Update the public address used for verifying attestations. Note we may allow multiple attestation
     *         sources so this could be extended to add/remove from a mapping of valid public addresses
     * @param _attestationProviderPublicAddress The new public address for verifying attestations.
     */
    function updateAttestationProviderPublicAddress(address _attestationProviderPublicAddress) public onlyOwner {
        attestationProviderPublicAddress = _attestationProviderPublicAddress;
    }

    /**
     * @notice Have a Bee token sent to the senders account if the attestation is valid.
     *         Can only be called once for each valid jwtMessageHash. This could be updated to include
     *         a hash of the users personal ID/passport number as the claimable item. In this case we would
     *         need to do more processing of the JWT message to ensure the ID number came from it.
     * @param jwtMessageHash sha256 hash of the first two parts of the JWT
     * @param v elliptic curve signature v value
     * @param r elliptic curve signature r value
     * @param s elliptic curve signature s value
     */
    function claimBee(bytes32 jwtMessageHash, uint8 v, bytes32 r, bytes32 s) public
    {
        require(canClaimBee(jwtMessageHash, v, r, s));

        attestationClaimedTimes[jwtMessageHash] = uint64(now);

        beeToken.generateTokens(msg.sender, 1);
        LogBeeClaimed(msg.sender);
    }

    /**
     * @notice Check if the attestation has already been claimed and the signature is valid
     * @return true if claimable, false otherwise
     */
    function canClaimBee(bytes32 jwtMessageHash, uint8 v, bytes32 r, bytes32 s) public constant returns (bool) {
        return notAlreadyClaimed(jwtMessageHash) && validAttestation(jwtMessageHash, v, r, s);
    }

    function notAlreadyClaimed(bytes32 jwtMessageHash) private returns (bool) {
        return attestationClaimedTimes[jwtMessageHash] < faucetStartTime;
    }

    function validAttestation(bytes32 jwtMessageHash, uint8 v, bytes32 r, bytes32 s) private returns (bool) {
        address signerPublicAddress = ecrecover(jwtMessageHash, v, r, s);
        return attestationProviderPublicAddress == signerPublicAddress;
    }
}

pragma solidity ^0.4.15;

import "./MiniMeToken.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";

// TODO: Restrict to certain periods and add more tests. kycProviderPublicAddress address also needs to be editable by owner.
// Should also up upgradable somehow (not sure how yet) as verification process could change in the future.
contract BeeFaucet is Ownable {

    MiniMeToken private beeToken;
    address public kycProviderPublicAddress; // For verifying attestations to individuality.
    mapping(bytes32 => bool) public claimedAttestations;

    event LogBeeClaimed(address receiver);

    function BeeFaucet(address _miniMeTokenFactoryAddress, address _appPublicAddress) {
        beeToken = new MiniMeToken(_miniMeTokenFactoryAddress, 0, 0, "Bee", 18, "BEE", true);
        kycProviderPublicAddress = _appPublicAddress;
    }

    modifier notAlreadyClaimed(bytes32 jwtMessageHash) { require(!claimedAttestations[jwtMessageHash]); _; }

    function getBeeTokenAddress() constant public returns (address) {
        return address(beeToken);
    }

    /**
     *  @notice Have a Bee token sent to the senders account if the attestation is valid.
     *          Can only be called once for each valid jwtMessageHash. This could be updated to include
     *          a hash of the users personal ID/passport number as the claimable item. In this case we would
     *          need to do more processing of the JWT message to ensure the ID number came from it.
     *  @param jwtMessageHash sha256 hash of the first two parts of the JWT
     *  @param v elliptic curve signature v value
     *  @param r elliptic curve signature r value
     *  @param s elliptic curve signature s value
     */
    function claimBee(bytes32 jwtMessageHash, uint8 v, bytes32 r, bytes32 s) public notAlreadyClaimed(jwtMessageHash) {

        // Validate the jwtMessage as being signed by the KYC providers account.
        address attestationSigner = ecrecover(jwtMessageHash, v, r, s);
        require(kycProviderPublicAddress == attestationSigner);

        // Update claimed attestation to prevent user claiming twice.
        claimedAttestations[jwtMessageHash] = true;

        beeToken.generateTokens(msg.sender, 1);
        LogBeeClaimed(msg.sender);
    }

}

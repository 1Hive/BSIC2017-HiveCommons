pragma solidity ^0.4.15;

import "./MiniMeToken.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";

// Would rather the attestation/JWT verification was a library, but for speed of development it will be integrated for now.
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
     *  @notice Have a Bee token sent to the senders account if the attestation is valid, should probably submit the sha256
                of the message instead of the jwtMessage part.
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

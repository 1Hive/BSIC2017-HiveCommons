pragma solidity ^0.4.13;


contract JwtAttestationVerifier {

    address public appPublicAddress;

    // Note to convert the public address in the uPort app manager interface to the correct format we must do the following:
    // web3.sha3("address from uPort app manager without 0x04 in lower case", {encoding: 'hex'}).slice(-40)
    function JwtAttestationVerifier(address _appPublicAddress) public{
        appPublicAddress = _appPublicAddress;
    }

    /**
     * @notice Verifies a JWT message signed using ES256K. Verifies against the app's public address.
     *         Notice we use sha256 for the JWT message as ES256K uses the Sha256 hashing algorithm, not Keccak256.
     * @param jwtMessage The first two parts of the JWT
     */
    function verifyAttestation(string jwtMessage, uint8 v, bytes32 r, bytes32 s) public constant returns (bool) {
        bytes32 jwtMessageHash = sha256(jwtMessage);
        address attestationSigner = ecrecover(jwtMessageHash, v, r, s);
        return appPublicAddress == attestationSigner;
    }
}

const JwtAttestationVerifier = artifacts.require("JwtAttestationVerifier.sol")
const JwtFormatter = require("../utils/JwtFormatter.js")

contract("JwtAttestationVerifier", () => {

    let jwtAttestationVerifier;
    const appPublicAddress = "0xdb2e8d0b7525dd9ce4ad87c38072c26850215aee"

    beforeEach(async () => jwtAttestationVerifier = await JwtAttestationVerifier.new(appPublicAddress))

    describe("verifyAttestation(string jwtMessage, uint8 v, bytes32 r, bytes32 s)", () => {

        it("correctly verifies valid attestation", async () => {
            const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJzdWIiOiIyb25qclJZeUZ1Um9Ya2RHalBaUXk4UjZoWGFGeE4yMmFEeCIsImNsYWltIjp7IlVuaXF1ZW5lc3MiOiJJcyB1bmlxdWUifSwiZXhwIjoxNTA4ODY3MDc5NTcwLCJpc3MiOiIyb2hhMVZyVkNhelhwTFRvY1ZSSG9mVVg1dVJEbXZQVWs0QiIsImlhdCI6MTUwNjI3NTA3OTU3MH0.j27nrUtF76OYoEcx2I5tJl1P8LCJj8hpI22Ca1kx7n_hI9K4BgbQyPbEG7tuCEdsGPukPvsUML2s-MSiRrZnfg"
            const formattedJwt = JwtFormatter.format(jwt)
            const attestationValid = await jwtAttestationVerifier.verifyAttestation(formattedJwt.jwtMessagePart, 27, formattedJwt.jwtSigRHex, formattedJwt.jwtSigSHex)

            assert.isTrue(attestationValid, "Attestation is not considered valid")
        })

        it("correctly verifies invalid attestation", async () => {
            const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJzdWIiOiIyb25qclJZeUZ1Um9Ya2RHalBaUXk4UjZoWGFGeE4yMmFEeCIsImNsYWltIjp7IlVuaXF1ZW5lc3MiOiJJcyB1bmlxdWUifSwiZXhwIjoxNTA4ODY3MDc5NTcwLCJpc3MiOiIyb2hhMVZyVkNhelhwTFRvY1ZSSG9mVVg1dVJEbXZQVWs0QiIsImlhdCI6MTUwNjI3NTA3OTU3MH0.j27nrUtF76OYoEcx2I5tJl1P8LCJj8hpI22Ca1kx70_hI9K4BgbQyPbEG7tuCEdsGPukPvsUML2s-MSiRrZnfg"
            const formattedJwt = JwtFormatter.format(jwt)
            const attestationValid = await jwtAttestationVerifier.verifyAttestation(formattedJwt.jwtMessagePart, 27, formattedJwt.jwtSigRHex, formattedJwt.jwtSigSHex)

            assert.isFalse(attestationValid, "Attestation is considered valid")
        })
    })
})
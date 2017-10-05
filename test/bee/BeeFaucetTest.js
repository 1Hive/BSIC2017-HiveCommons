const MiniMeTokenFactory = artifacts.require("MiniMeTokenFactory.sol")
const MiniMeToken = artifacts.require("MiniMeToken.sol")
const BeeFaucet = artifacts.require("BeeFaucet.sol")
const ValidationUtils = require("../../src/utils/ValidationUtils.js")
const TestUtils = require("../TestUtils.js")

contract("BeeFaucet", accounts => {

    let miniMeTokenFactory, beeFaucet, beeToken;
    const kycProviderPublicAddress = "0xdb2e8d0b7525dd9ce4ad87c38072c26850215aee"
    const jwtWithValidSignature = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJzdWIiOiIyb25qclJZeUZ1Um9Ya2RHalBaUXk4UjZoWGFGeE4yMmFEeCIsImNsYWltIjp7IlVuaXF1ZW5lc3MiOiJJcyB1bmlxdWUifSwiZXhwIjoxNTA4ODY3MDc5NTcwLCJpc3MiOiIyb2hhMVZyVkNhelhwTFRvY1ZSSG9mVVg1dVJEbXZQVWs0QiIsImlhdCI6MTUwNjI3NTA3OTU3MH0.j27nrUtF76OYoEcx2I5tJl1P8LCJj8hpI22Ca1kx7n_hI9K4BgbQyPbEG7tuCEdsGPukPvsUML2s-MSiRrZnfg"
    // const kycProviderPublicAddress = "0x43254ffee679447fd11fa5a1003569bd81f7c0af"
    // const jwtWithValidSignature = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJzdWIiOiIyb2Z5THlxZXRhSFpCMnBta2RYZm1icUNMelQ1QkpFTFZOMiIsImNsYWltIjp7IlVuaXF1ZW5lc3MiOiJJcyBVbmlxdWUgLyBIYXNoIG9mIHRoZWlyIHBhc3Nwb3J0IG51bWJlciJ9LCJleHAiOjE1MzgyMjI3OTg1MjksImlzcyI6IjJvdHdrSnF2RzhtNWR0OVJldlFHaUhYR2gzTmV6MWk3S0RXIiwiaWF0IjoxNTA2Njg2Nzk4NTI5fQ.cF-QFJ1pOGoJdlfaPgtUuYrm07wCKwOLCFNW4aCcJgttnuy0kpVWfWAcx4EGDeg_Ocrt-Zz2qdrT4HnyOSdZXQ"
    const jwtWithInvalidSignature = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJzdWIiOiIyb25qclJZeUZ1Um9Ya2RHalBaUXk4UjZoWGFGeE4yMmFEeCIsImNsYWltIjp7IlVuaXF1ZW5lc3MiOiJJcyB1bmlxdWUifSwiZXhwIjoxNTA4ODY3MDc5NTcwLCJpc3MiOiIyb2hhMVZyVkNhelhwTFRvY1ZSSG9mVVg1dVJEbXZQVWs0QiIsImlhdCI6MTUwNjI3NTA3OTU3MH0.j27nrUtF76OYoEcx2I5tJl1P8LCJj8hpI22Ca1kx70_hI9K4BgbQyPbEG7tuCEdsGPukPvsUML2s-MSiRrZnfg"

    beforeEach(async () => {
        miniMeTokenFactory = await MiniMeTokenFactory.new();
        beeFaucet = await BeeFaucet.new(miniMeTokenFactory.address, kycProviderPublicAddress)
        const beeTokenAddress = await beeFaucet.getBeeTokenAddress()
        beeToken = MiniMeToken.at(beeTokenAddress)
    })

    describe("BeeFaucet() constructor", () => {

        it("creates a new MiniMeToken representing BEE", async () => {
            assert.equal(await beeToken.totalSupply(), 0, "Total supply is not 0")
            assert.equal(await beeToken.name(), "Bee", "Name is not Bee")
            assert.equal(await beeToken.decimals(), 18, "Decimals is not 18")
            assert.equal(await beeToken.symbol(), "BEE", "Symbol is not BEE")
        })

        it("sets kycProviderPublicAddress", async () => {
            const actualKycProviderPublicAddress = await beeFaucet.kycProviderPublicAddress()
            assert.equal(actualKycProviderPublicAddress, kycProviderPublicAddress, "Kyc public address is incorrect")
        })

        it("creates a new faucet with correct end time", async () => {
            const currentBlockTime = web3.eth.getBlock("latest").timestamp
            const expectedEndTime = currentBlockTime + 31540000
            const faucetEndTime = await beeFaucet.faucetEndTime()

            assert.closeTo(faucetEndTime.toNumber(), expectedEndTime, 2, "Faucet end time is not equal to expected end time")
        })
    })

    describe("createFaucet()", () => {

        it("creates a new faucet with correct end time when old faucet has expired", async () => {
            TestUtils.increaseTestRpcTime(web3, 31540005)
            await beeFaucet.createFaucet()
            const currentBlockTime = web3.eth.getBlock("latest").timestamp
            const expectedEndTime = currentBlockTime + 31540000
            const faucetEndTime = await beeFaucet.faucetEndTime()

            assert.equal(faucetEndTime, expectedEndTime, "Faucet end time is not equal to expected end time")
        })

        it("does not create a new faucet before old faucet has expired", async () => {
            TestUtils.increaseTestRpcTime(web3, 31539999)
            const maxGasUsed = 2000000

            await TestUtils.assertThrows(() => beeFaucet.createFaucet({gas: maxGasUsed}), maxGasUsed)
        })

        it("creates a new Bee token", async () => {
            const currentBeeTokenAddress = await beeFaucet.getBeeTokenAddress();
            TestUtils.increaseTestRpcTime(web3, 31540000)
            await beeFaucet.createFaucet()
            const newBeeTokenAddress = await beeFaucet.getBeeTokenAddress()

            assert.notEqual(newBeeTokenAddress, currentBeeTokenAddress, "Bee token has not been recreated")
        })
    })

    describe("canClaimBee(bytes32 jwtMessageHash, uint8 v, bytes32 r, bytes32 s)", () => {

        const receiverAccount = accounts[0]

        it("returns true when signature is valid and jwtMessageHash hasn't already been claimed against", async () => {
            const formattedJwt = ValidationUtils.formatJwt(jwtWithValidSignature)
            const canClaimBee = await beeFaucet.canClaimBee(formattedJwt.sha256jwtMessagePart, 27, formattedJwt.jwtSigRHex, formattedJwt.jwtSigSHex)

            assert.isTrue(canClaimBee, "signature or jwtMessageHash is invalid")
        })

        it("returns false when signature is invalid and jwtMessageHash hasn't already been claimed against", async () => {
            const formattedJwt = ValidationUtils.formatJwt(jwtWithInvalidSignature)
            const canClaimBee = await beeFaucet.canClaimBee(formattedJwt.sha256jwtMessagePart, 27, formattedJwt.jwtSigRHex, formattedJwt.jwtSigSHex)

            assert.isFalse(canClaimBee, "signature and jwtMessageHash is valid")
        })

        it("returns false when signature is valid but jwtMessageHash has already been claimed against", async () => {
            const formattedJwt = ValidationUtils.formatJwt(jwtWithValidSignature)
            await beeFaucet.claimBee(formattedJwt.sha256jwtMessagePart, 27, formattedJwt.jwtSigRHex, formattedJwt.jwtSigSHex, {from: receiverAccount})
            const canClaimBee = await beeFaucet.canClaimBee(formattedJwt.sha256jwtMessagePart, 27, formattedJwt.jwtSigRHex, formattedJwt.jwtSigSHex)

            assert.isFalse(canClaimBee, "signature and jwtMessageHash is valid")
        })
    })

    describe("claimBee(address receiverAddress, string jwtMessage, uint8 signatureV, bytes32 signatureR, bytes32 signatureS)", () => {

        const receiverAccount = accounts[1]
        const maxGasUsed = 2000000;

        it("sends one BEE to receiverAddress if attestation is valid", async () => {
            const formattedJwt = ValidationUtils.formatJwt(jwtWithValidSignature)
            await beeFaucet.claimBee(formattedJwt.sha256jwtMessagePart, 27, formattedJwt.jwtSigRHex, formattedJwt.jwtSigSHex, {from: receiverAccount})
            const receiverBalance = await beeToken.balanceOf(receiverAccount)

            assert.equal(receiverBalance, 1, "Receiver's balance should be 1")
        })


        it("doesn't send BEE to receiverAddress if attestation is invalid", async () => {
            const formattedJwt = ValidationUtils.formatJwt(jwtWithInvalidSignature)

            await TestUtils.assertThrows(() => beeFaucet.claimBee(formattedJwt.sha256jwtMessagePart, 27, formattedJwt.jwtSigRHex, formattedJwt.jwtSigSHex,
                {from: receiverAccount, gas: maxGasUsed}), maxGasUsed)
        })

        it("doesn't send BEE to receiverAddress if attestation already claimed against", async () => {
            const formattedJwt = ValidationUtils.formatJwt(jwtWithValidSignature)
            await beeFaucet.claimBee(formattedJwt.sha256jwtMessagePart, 27, formattedJwt.jwtSigRHex, formattedJwt.jwtSigSHex, {from: receiverAccount})

            await TestUtils.assertThrows(() => beeFaucet.claimBee(formattedJwt.sha256jwtMessagePart, 27, formattedJwt.jwtSigRHex, formattedJwt.jwtSigSHex,
                {from: receiverAccount, gas: maxGasUsed}), maxGasUsed)
        })
    })
})
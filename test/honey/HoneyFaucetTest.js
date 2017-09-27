const BeeFaucet = artifacts.require("BeeFaucet.sol")
const MiniMeTokenFactory = artifacts.require("MiniMeTokenFactory.sol")
const HoneyFaucet = artifacts.require("HoneyFaucet.sol")
const TestUtils = require("../TestUtils.js")

contract("HoneyFaucet", () => {

    let beeFaucet, honeyFaucet
    const kycProviderPublicAddress = "0xdb2e8d0b7525dd9ce4ad87c38072c26850215aee"

    beforeEach(async () => {
        const miniMeTokenFactory = await MiniMeTokenFactory.new();
        beeFaucet = await BeeFaucet.new(miniMeTokenFactory.address, kycProviderPublicAddress)
        honeyFaucet = await HoneyFaucet.new(beeFaucet.address)
    })

    describe("createFaucet()", () => {

        it("creates a new faucet with correct end block", async () => {
            await honeyFaucet.createFaucet()
            const currentBlock = await TestUtils.convertToPromise(web3.eth.getBlockNumber)
            const expectedEndBlock = currentBlock + 175000
            const faucetEndBlock = await honeyFaucet.currentFaucetEndBlock()

            assert.equal(faucetEndBlock, expectedEndBlock, "Faucet end block is not equal to expected end block")
        })
    })
})
const MiniMeTokenFactory = artifacts.require("./MiniMeTokenFactory.sol")
const MiniMeToken = artifacts.require("MiniMeToken.sol")
const TestUtils = require("../TestUtils.js")

contract("MiniMeToken", accounts => {

    let miniMeTokenFactory, miniMeToken

    beforeEach(async () => {
        miniMeTokenFactory = await MiniMeTokenFactory.new()
        miniMeToken = await MiniMeToken.new(miniMeTokenFactory.address, 0, 0, "TestToken", 18, "TTN", true)
        await miniMeToken.generateTokens(accounts[0], 1000)
    })

    describe("generateTokens(address, uint)", () => {

        it("generates expected tokens", async () => {
            const acc1Balance = await miniMeToken.balanceOf(accounts[0])

            assert.equal(acc1Balance, 1000, "Acc1 balance is incorrect, did not generate tokens")
        })
    })

    describe("destroyTokens(address, uint", () => {

        it("destroys expected tokens", async () => {
            await miniMeToken.destroyTokens(accounts[0], 100)
            const acc1Balance = await miniMeToken.balanceOf(accounts[0])

            assert.equal(acc1Balance, 900, "Acc1 balance is incorrect, did not destroy tokens")
        })
    })

    describe("copying MiniMe token via constructor", () => {

        it("copies balances", async () => {
            const currentBlockNumber = await TestUtils.convertToPromise(web3.eth.getBlockNumber)
            const miniMeTokenCopy = await MiniMeToken.new(miniMeTokenFactory.address, miniMeToken.address, currentBlockNumber, "TestTokenCopy", 18, "TT2", true)
            const copiedAcc1Balance = await miniMeTokenCopy.balanceOf(accounts[0])

            assert.equal(copiedAcc1Balance, 1000, "Acc1 balance is incorrect, token was not copied successfully")
        })
    })

    describe("createCloneToken(string cloneTokenName, uint8 cloneDecimalUnits, " +
        "string cloneTokenSymbol, uint snapshotBlock, bool transfersEnabled)", () => {

        it("copies balances", async () => {
            await miniMeToken.createCloneToken("TestTokenCopy", 18, "TT2", 0, true)
            const newCloneTokenEventArgs = await TestUtils.listenForEvent(miniMeToken.NewCloneToken())
            const copiedAcc1Balance = await MiniMeToken.at(newCloneTokenEventArgs._cloneToken).balanceOf(accounts[0])

            assert.equal(copiedAcc1Balance, 1000, "Acc1 balance is incorrect, token was not copied successfully")
        })
    })

    describe("transfer(address to, uint256 amount)", () => {

        it("increases in gas cost the first time miniMeToken is copied", async () => {
            const tx = await miniMeToken.transfer(accounts[1], 100)
            assert.equal(tx.receipt.gasUsed, 100134, "Gas use for first transfer is unexpected")

            const miniMeTokenFirstCopy = await MiniMeToken.new(miniMeTokenFactory.address, miniMeToken.address, web3.eth.blockNumber, "TestTokenCopy", 18, "TT2", true)
            const tx2 = await miniMeTokenFirstCopy.transfer(accounts[1], 100)
            assert.equal(tx2.receipt.gasUsed, 123596, "Gas use for second transfer is unexpected")

            const miniMeTokenSecondCopy = await MiniMeToken.new(miniMeTokenFactory.address, miniMeTokenFirstCopy.address, web3.eth.blockNumber, "TestTokenCopy", 18, "TT3", true)
            const tx3 = await miniMeTokenSecondCopy.transfer(accounts[1], 100)
            assert.equal(tx3.receipt.gasUsed, 123596, "Gas use for third transfer is unexpected")
        })
    })
})
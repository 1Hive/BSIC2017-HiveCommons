const MiniMeTokenFactory = artifacts.require("MiniMeTokenFactory.sol")
const MiniMeToken = artifacts.require("MiniMeToken.sol")
const BeeFaucet = artifacts.require("BeeFaucet.sol")
const HoneyFaucet = artifacts.require("HoneyFaucet.sol")
const HoneyToken = artifacts.require("HoneyToken.sol")

const TestUtils = require("../TestUtils.js")
const JwtFormatter = require("../../utils/JwtFormatter.js")

// Some of these tests will only run on TestRpc, those using evm_increaseTime.
contract("HoneyFaucet", accounts => {

    let beeFaucet, beeToken, honeyFaucet, honeyToken
    const kycProviderPublicAddress = "0xdb2e8d0b7525dd9ce4ad87c38072c26850215aee"

    beforeEach(async () => {
        const miniMeTokenFactory = await MiniMeTokenFactory.new()

        beeFaucet = await BeeFaucet.new(miniMeTokenFactory.address, kycProviderPublicAddress)
        const beeTokenAddress = await beeFaucet.getBeeTokenAddress()
        beeToken = MiniMeToken.at(beeTokenAddress)

        honeyToken = await HoneyToken.new()
        honeyFaucet = await HoneyFaucet.new(honeyToken.address, beeFaucet.address)
    })

    describe("HoneyFaucet() constructor", () => {

        it("creates a new faucet with correct end time", async () => {
            const currentBlockTime = web3.eth.getBlock("latest").timestamp
            const expectedEndTime = currentBlockTime + 2628000
            const faucetEndTime = await honeyFaucet.currentFaucetEndTime()

            assert.equal(faucetEndTime, expectedEndTime, "Faucet end time is not equal to expected end time")
        })
    })

    describe("createFaucet()", () => {

        it("creates a new faucet with correct end time when old faucet has expired", async () => {
            TestUtils.increaseTestRpcTime(web3, 2628005)
            await honeyFaucet.createFaucet()
            const currentBlockTime = web3.eth.getBlock("latest").timestamp
            const expectedEndTime = currentBlockTime + 2628000
            const faucetEndTime = await honeyFaucet.currentFaucetEndTime()

            assert.equal(faucetEndTime, expectedEndTime, "Faucet end time is not equal to expected end time")
        })

        it("does not create a new faucet before old faucet has expired", async () => {
            const maxGasUsed = 2000000
            TestUtils.increaseTestRpcTime(web3, 2627999)

            await TestUtils.assertThrows(() => honeyFaucet.createFaucet({gas: maxGasUsed}), maxGasUsed)
        })

        it("creates an accurate clone of Bee token", async () => {
            const receiverAccount = accounts[1]
            await grantBeeTokenToAccount(receiverAccount);

            TestUtils.increaseTestRpcTime(web3, 2628005)
            await honeyFaucet.createFaucet()
            beeTokenCloneAddress = await honeyFaucet.getBeeTokenCloneAddress()
            const beeTokenClone = MiniMeToken.at(beeTokenCloneAddress)
            const beeTokenCloneBalance = await beeTokenClone.balanceOf(receiverAccount)

            assert.equal(beeTokenCloneBalance, 1, "Bee token has not been cloned correctly")
        })

    })

    describe("claimHoney()", () => {

        it("awards correct amount of Honey to the senders account relative to the amount of Bee in the same account", async () => {
            const honeyReceiverAccount = accounts[1]
            await distributeAndTransferOwnership();
            await grantBeeTokenToAccount(honeyReceiverAccount)
            await honeyFaucet.claimHoney({from: honeyReceiverAccount})
            const honeyTokenBalance = await honeyToken.balanceOf(honeyReceiverAccount)

            assert.equal(honeyTokenBalance.toNumber(), 1000, "Receivers honey token balance is not as expected")
        })
    })

    const distributeAndTransferOwnership = async () => {
        await honeyToken.mint(10 ** 24, accounts[5]) // 10^18(token decimal places)+8(multiplier of tokens) = 100000000 initial tokens
        await honeyToken.transferOwnership(honeyFaucet.address)
    }

    const grantBeeTokenToAccount = async (account) => {
        const jwtWithValidSignature = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJzdWIiOiIyb25qclJZeUZ1Um9Ya2RHalBaUXk4UjZoWGFGeE4yMmFEeCIsImNsYWltIjp7IlVuaXF1ZW5lc3MiOiJJcyB1bmlxdWUifSwiZXhwIjoxNTA4ODY3MDc5NTcwLCJpc3MiOiIyb2hhMVZyVkNhelhwTFRvY1ZSSG9mVVg1dVJEbXZQVWs0QiIsImlhdCI6MTUwNjI3NTA3OTU3MH0.j27nrUtF76OYoEcx2I5tJl1P8LCJj8hpI22Ca1kx7n_hI9K4BgbQyPbEG7tuCEdsGPukPvsUML2s-MSiRrZnfg"
        const formattedJwt = JwtFormatter.format(jwtWithValidSignature)
        await beeFaucet.claimBee(formattedJwt.sha256jwtMessagePart, 27, formattedJwt.jwtSigRHex, formattedJwt.jwtSigSHex, {from: account})
    }
})
const MiniMeTokenFactory = artifacts.require("MiniMeTokenFactory.sol")
const MiniMeToken = artifacts.require("MiniMeToken.sol")
const BeeFaucet = artifacts.require("BeeFaucet.sol")
const HoneyFaucet = artifacts.require("HoneyFaucet.sol")
const HoneyToken = artifacts.require("HoneyToken.sol")

const TestUtils = require("../TestUtils.js")
const ValidationUtils = require("../../utils/ValidationUtils.js")

// Some of these tests will only run on TestRpc, those using evm_increaseTime (TestUtils.increaseTestRpcTime()).
contract("HoneyFaucet", accounts => {

    let beeFaucet, beeToken, honeyFaucet, honeyToken
    const beeOwner1 = accounts[1]
    const beeOwner2 = accounts[2]
    const jwtWithValidSignature1 = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJzdWIiOiIyb3Zvb2ZHWVVwcTZHRjZKa042NHFnQjRodmZSTnZ5YW51diIsImNsYWltIjp7IlVuaXF1ZW5lc3MiOiJJcyBVbmlxdWUgLyBIYXNoIG9mIHRoZWlyIHBhc3Nwb3J0IG51bWJlciJ9LCJleHAiOjE1MzgwNjE3Njc3NjgsImlzcyI6IjJvdHdrSnF2RzhtNWR0OVJldlFHaUhYR2gzTmV6MWk3S0RXIiwiaWF0IjoxNTA2NTI1NzY3NzY5fQ.fP3lyuSPf1QYOiQmAP3gAN6tpFgJJuRDPnMj9k8AoaWarMgwYym_0QP4nZNI3v1hhToeMbtgdemFvQTIe1mx2w"
    const jwtWithValidSignature2 = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJzdWIiOiIyb2Z5THlxZXRhSFpCMnBta2RYZm1icUNMelQ1QkpFTFZOMiIsImNsYWltIjp7IlVuaXF1ZW5lc3MiOiJJcyBVbmlxdWUgLyBIYXNoIG9mIHRoZWlyIHBhc3Nwb3J0IG51bWJlciJ9LCJleHAiOjE1MzgxNTA3Mjc4ODIsImlzcyI6IjJvdHdrSnF2RzhtNWR0OVJldlFHaUhYR2gzTmV6MWk3S0RXIiwiaWF0IjoxNTA2NjE0NzI3ODgyfQ._XC-zNLpVrLC5T8nwWI9Xou4qHNR9GXtB252nCW5VgFORAuBVx2jZzuwkG-7uF_f3px1gkAO2vGWPM8EDdAxvQ"
    const uPortAppPublicKey = "0x04f5188765f769dd4cf0b1cbcb93afe9ed3eab6820cbc34b9aba78bb7b8a66026dc3a08acac3a32a35815c8eee69a417fae26c56172217963dc14fd5a63c6987e4"

    beforeEach(async () => {
        await createBeeContracts();
        await createHoneyContracts();
        await initDistributionAndTransferOwnership();
        await grantBeeTokenToAccount(beeOwner1, jwtWithValidSignature1)
    })

    const createBeeContracts = async () => {
        const miniMeTokenFactory = await MiniMeTokenFactory.new()
        const kycProviderPublicAddress = ValidationUtils.addressFromPublicKey(web3, uPortAppPublicKey)
        beeFaucet = await BeeFaucet.new(miniMeTokenFactory.address, kycProviderPublicAddress)
        const beeTokenAddress = await beeFaucet.getBeeTokenAddress()
        beeToken = MiniMeToken.at(beeTokenAddress)
    }

    const createHoneyContracts = async () => {
        honeyToken = await HoneyToken.new()
        honeyFaucet = await HoneyFaucet.new(honeyToken.address, beeFaucet.address)
    }

    const initDistributionAndTransferOwnership = async () => {
        await honeyToken.mint(accounts[5], 10 ** 26) // 10^18(token decimal places)+8(multiplier of tokens) = 100000000 initial tokens
        await honeyToken.transferOwnership(honeyFaucet.address)
    }

    const grantBeeTokenToAccount = async (account, jwtWithValidSignature) => {
        const formattedJwt = ValidationUtils.formatJwt(jwtWithValidSignature)
        await beeFaucet.claimBee(formattedJwt.sha256jwtMessagePart, 27, formattedJwt.jwtSigRHex, formattedJwt.jwtSigSHex, {from: account})
    }

    describe("createFaucet()", () => {

        it("creates a new faucet with correct end time", async () => {
            const currentBlockTime = web3.eth.getBlock("latest").timestamp
            const expectedEndTime = currentBlockTime + 2628000
            await honeyFaucet.createFaucet()
            const faucetEndTime = await honeyFaucet.faucetEndTime()

            assert.equal(faucetEndTime, expectedEndTime, "Faucet end time is not equal to expected end time")
        })

        it("creates a new faucet with correct end time when old faucet has expired", async () => {
            await honeyFaucet.createFaucet()
            TestUtils.increaseTestRpcTime(web3, 2628005)
            await honeyFaucet.createFaucet()
            const currentBlockTime = web3.eth.getBlock("latest").timestamp
            const expectedEndTime = currentBlockTime + 2628000
            const faucetEndTime = await honeyFaucet.faucetEndTime()

            assert.equal(faucetEndTime, expectedEndTime, "Faucet end time is not equal to expected end time")
        })

        it("does not create a new faucet before old faucet has expired", async () => {
            const maxGasUsed = 2000000
            await honeyFaucet.createFaucet()
            TestUtils.increaseTestRpcTime(web3, 2627999)

            await TestUtils.assertThrows(() => honeyFaucet.createFaucet({gas: maxGasUsed}), maxGasUsed)
        })

        it("creates an accurate clone of Bee token", async () => {
            await honeyFaucet.createFaucet()
            const beeTokenCloneAddress = await honeyFaucet.getBeeTokenCloneAddress()
            const beeTokenClone = MiniMeToken.at(beeTokenCloneAddress)
            const beeTokenCloneBalance = await beeTokenClone.balanceOf(beeOwner1)

            assert.equal(beeTokenCloneBalance, 1, "Bee token has not been cloned correctly")
        })

        it("creates correct Honey For Bee exchange rate", async () => {
            await honeyFaucet.createFaucet()
            const honeyForBeeRate = await honeyFaucet.honeyForBeeRate()
            assert.equal(honeyForBeeRate.toNumber(), 1.25e+24, "Honey for bee rate is incorrect")
        })

    })

    describe("claimHoney()", () => {

        const maxGasUsed = 2000000

        it("awards correct amount of Honey to the senders account relative to the amount of Bee in the same account", async () => {
            const expectedClaimAmount = 1.25e+24;
            await honeyFaucet.createFaucet()
            await honeyFaucet.claimHoney({from: beeOwner1})
            const honeyTokenBalance = await honeyToken.balanceOf(beeOwner1)

            assert.equal(honeyTokenBalance.toNumber(), expectedClaimAmount, "Receivers honey token balance is not as expected")
        })

        it("fails if sender's account has no Bee", async () => {
            const honeyReceiverAccount = accounts[2]
            await honeyFaucet.createFaucet()

            await TestUtils.assertThrows(() => honeyFaucet.claimHoney({
                from: honeyReceiverAccount,
                gas: maxGasUsed
            }), maxGasUsed)
        })

        it("fails when attempting to claim Honey from the same account twice", async () => {
            await honeyFaucet.createFaucet()
            await honeyFaucet.claimHoney({from: beeOwner1})

            await TestUtils.assertThrows(() => honeyFaucet.claimHoney({from: beeOwner1, gas: maxGasUsed}), maxGasUsed)
        })

        it ("awards correct amount of Honey to multiple claimers", async () => {
            const expectedClaimAmount = 6.25e+23;
            await grantBeeTokenToAccount(beeOwner2, jwtWithValidSignature2)
            await honeyFaucet.createFaucet()
            await honeyFaucet.claimHoney({from: beeOwner1})
            await honeyFaucet.claimHoney({from: beeOwner2})
            const honeyTokenBalance1 = await honeyToken.balanceOf(beeOwner1)
            const honeyTokenBalance2 = await honeyToken.balanceOf(beeOwner2)

            assert.equal(honeyTokenBalance1.toNumber(), expectedClaimAmount, "Receivers honey token balance is not as expected")
            assert.equal(honeyTokenBalance2.toNumber(), expectedClaimAmount, "Receivers honey token balance is not as expected")
        })
    })

})
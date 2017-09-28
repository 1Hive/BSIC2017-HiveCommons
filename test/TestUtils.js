// This has been tested with the real Ethereum network and Testrpc.
// Copied and edited from: https://gist.github.com/xavierlepretre/d5583222fde52ddfbc58b7cfa0d2d0a9

assertThrowsMessage = (contractMethodCall, maxGasAvailable, assertMessage) => {
    return new Promise((resolve, reject) => {
        try {
            resolve(contractMethodCall())
        } catch (error) {
            reject(error)
        }
    })
        .then(tx => {
            assert.equal(tx.receipt.gasUsed, maxGasAvailable, assertMessage)
        })
        .catch(error => {
            if ((error + "").indexOf("invalid opcode") < 0 && (error + "").indexOf("out of gas") < 0) {
                // Checks if the error is from TestRpc. If it is then ignore it.
                // Otherwise relay/throw the error produced by the above assertion.
                // Note that no error is thrown when using a real Ethereum network AND the assertion above is true.
                throw error
            }
        })
}
exports.assertThrowsMessage = assertThrowsMessage

exports.assertThrows = (contractMethodCall, maxGasAvailable) =>
    assertThrowsMessage(contractMethodCall, maxGasAvailable, "Tx successful, the max gas available was not consumed")

exports.listenForEvent = event => new Promise((resolve, reject) => {
    event.watch((error, response) => {
        if (!error) {
            resolve(response.args)
        } else {
            reject(error)
        }
        event.stopWatching()
    })
})

exports.convertToPromise = functionWithCallbackParam => new Promise((resolve, reject) => {
    functionWithCallbackParam((error, response) => {
        if (!error) {
            resolve(response)
        } else {
            reject(error)
        }
    })
})

exports.increaseTestRpcTime = (web3, seconds) =>
    web3.currentProvider.send({jsonrpc: "2.0", method: "evm_increaseTime", params: [seconds], id: 0})
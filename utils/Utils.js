

exports.convertToPromise = functionWithCallbackParam => new Promise((resolve, reject) => {
  functionWithCallbackParam((error, response) => {
    if (!error) {
      resolve(response)
    } else {
      reject(error)
    }
  })
})
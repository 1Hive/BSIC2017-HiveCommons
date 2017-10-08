exports.getJwtForAttestation = (verifiedAttestationsList, attestation) =>
  verifiedAttestationsList
    .filter(_attestation => attestation in _attestation.claim)[0]
    .jwt

exports.convertToPromise = functionWithCallbackParam => new Promise((resolve, reject) => {
  functionWithCallbackParam((error, response) => {
    if (!error) {
      resolve(response)
    } else {
      reject(error)
    }
  })
})



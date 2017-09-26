const ecdsaSigFormatter = require("./ecdsaSigFormatter.js")
const signature = require("elliptic/lib/elliptic/ec/signature.js")
const sha256 = require('sha256')

exports.format = jwt => {
    const jwtSplit = jwt.split(".")

    const jwtMessagePart = jwtSplit[0] + "." + jwtSplit[1]
    const sha256jwtMessagePart = "0x" + sha256(jwtMessagePart)

    const jwtVerificationPart = jwtSplit[2]
    const formattedJwtVerification = ecdsaSigFormatter.joseToDer(jwtVerificationPart, "ES256")
    const jwtSignature = new signature(formattedJwtVerification, 'hex')
    const jwtSigRHex = "0x" + jwtSignature.r.toString("hex")
    const jwtSigSHex = "0x" + jwtSignature.s.toString("hex")

    return {sha256jwtMessagePart, jwtMessagePart, jwtSigRHex, jwtSigSHex}
}
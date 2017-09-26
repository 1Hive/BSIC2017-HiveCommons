const ecdsaSigFormatter = require("./ecdsaSigFormatter.js")
const signature = require("../node_modules/elliptic/lib/elliptic/ec/signature.js")

exports.format = jwt => {
    const jwtSplit = jwt.split(".")
    const jwtMessagePart = jwtSplit[0] + "." + jwtSplit[1]
    const jwtVerificationPart = jwtSplit[2]

    const formattedJwtVerification = ecdsaSigFormatter.joseToDer(jwtVerificationPart, "ES256")
    const jwtSignature = new signature(formattedJwtVerification, 'hex')
    const jwtSigRHex = "0x" + jwtSignature.r.toString("hex")
    const jwtSigSHex = "0x" + jwtSignature.s.toString("hex")

    return {jwtMessagePart, jwtSigRHex, jwtSigSHex}
}
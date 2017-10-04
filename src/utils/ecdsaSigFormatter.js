// Copied from blockstack jsontokens-js library: https://github.com/blockstack/jsontokens-js/blob/0dd98481cb4102312419560a554e74f9509dc519/src/cryptoClients/ecdsaSigFormatter.js

function getParamSize(keySize) {
  return ((keySize / 8) | 0) + (keySize % 8 === 0 ? 0 : 1)
}

const paramBytesForAlg = {
  ES256: getParamSize(256),
  ES384: getParamSize(384),
  ES512: getParamSize(521)
}

function getParamBytesForAlg(alg) {
  let paramBytes = paramBytesForAlg[alg];
  if (paramBytes) {
    return paramBytes;
  }

  throw new Error('Unknown algorithm "' + alg + '"');
}

let MAX_OCTET = 0x80,
    CLASS_UNIVERSAL = 0,
    PRIMITIVE_BIT = 0x20,
    TAG_SEQ = 0x10,
    TAG_INT = 0x02,
    ENCODED_TAG_SEQ = (TAG_SEQ | PRIMITIVE_BIT) | (CLASS_UNIVERSAL << 6),
    ENCODED_TAG_INT = TAG_INT | (CLASS_UNIVERSAL << 6);

function signatureAsBuffer(signature) {
  if (Buffer.isBuffer(signature)) {
    return signature;
  } else if ('string' === typeof signature) {
    return Buffer.from(signature, 'base64');
  }

  throw new TypeError('ECDSA signature must be a Base64 string or a Buffer');
}

function countPadding(buf, start, stop) {
  let padding = 0;
  while (start + padding < stop && buf[start + padding] === 0) {
    ++padding;
  }

  let needsSign = buf[start + padding] >= MAX_OCTET;
  if (needsSign) {
    --padding;
  }

  return padding;
}

exports.joseToDer = (signature, alg) => {
  signature = signatureAsBuffer(signature);
  let paramBytes = getParamBytesForAlg(alg);

  let signatureBytes = signature.length;
  if (signatureBytes !== paramBytes * 2) {
    throw new TypeError('"' + alg + '" signatures must be "' + paramBytes * 2 + '" bytes, saw "' + signatureBytes + '"');
  }

  let rPadding = countPadding(signature, 0, paramBytes);
  let sPadding = countPadding(signature, paramBytes, signature.length);
  let rLength = paramBytes - rPadding;
  let sLength = paramBytes - sPadding;

  let rsBytes = 1 + 1 + rLength + 1 + 1 + sLength;

  let shortLength = rsBytes < MAX_OCTET;

  let dst = Buffer.allocUnsafe((shortLength ? 2 : 3) + rsBytes);

  let offset = 0;
  dst[offset++] = ENCODED_TAG_SEQ;
  if (shortLength) {
    // Bit 8 has value "0"
    // bits 7-1 give the length.
    dst[offset++] = rsBytes;
  } else {
    // Bit 8 of first octet has value "1"
    // bits 7-1 give the number of additional length octets.
    dst[offset++] = MAX_OCTET | 1;
    // length, base 256
    dst[offset++] = rsBytes & 0xff;
  }
  dst[offset++] = ENCODED_TAG_INT;
  dst[offset++] = rLength;
  if (rPadding < 0) {
    dst[offset++] = 0;
    offset += signature.copy(dst, offset, 0, paramBytes);
  } else {
    offset += signature.copy(dst, offset, rPadding, paramBytes);
  }
  dst[offset++] = ENCODED_TAG_INT;
  dst[offset++] = sLength;
  if (sPadding < 0) {
    dst[offset++] = 0;
    signature.copy(dst, offset, paramBytes);
  } else {
    signature.copy(dst, offset, paramBytes + sPadding);
  }

  return dst;
}

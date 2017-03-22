const crypto = require("crypto");

function _createBlockFromMessage(pojso) {
    let strRepr = Object.keys(pojso).reduce((prev, cur) => {
        return prev + "\n" + escapeStr(pojso[cur]);
    }, "");

    const payload = Buffer.from(strRepr, "utf8");
    const length = Buffer.from(String(payload.length), "utf8");

    // We need our block to have a size which is a multiple of 16 (128 bit, as used by AES128)
    const totalLength = calcPadding(length.length + payload.length, 16);
    return Buffer.concat([length, payload], totalLength);

    function escapeStr(str) {
        str = str.replace(/\\/g, "\\\\"); // replace \ with \\
        return str.replace(/\n/g, "\\n");
    }

    function calcPadding(actualLength, multipleOf) {
        const padLength = multipleOf - actualLength % multipleOf;
        return actualLength + padLength;
    }
}

/*
    Probably it is a good idea to enforce the key to be an ascii encoded string because? Arduino
    libs might struggle otherwise. For all characters in ASCII (not Extended-ASCII) UTF8 encoded buffer
    should be the same.
*/
function _addHMAC(block, key) {
    // Maybe we should use MD5? It's broken, but it's way faster to compute
    const hasher = crypto.createHash("sha256");
    hasher.update(Buffer.concat([block, Buffer(key, "ascii")]));

    const hmac = hasher.digest();

    return Buffer.concat([block, hmac]);    
}

function encodeMessage(pojso, key) {
    let block = _createBlockFromMessage(pojso);
    block = _addHMAC(block, key); 

    // TODO Add encryption, fit key to 128 Bit via MD5

    return block;
}

module.exports = {
    encodeMessage,
    _createBlockFromMessage,
    _addHMAC
};
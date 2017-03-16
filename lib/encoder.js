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

function _addHMAC(block, key) {
    const hasher = crypto.createHash("sha256");
    hasher.update(Buffer.concat([block, Buffer(key, "ascii")]));

    const hmac = hasher.digest();
    
    return Buffer.concat([block, hmac]);    
}

function encodeMessage(pojso, key) {

}

module.exports = {
    encodeMessage,
    _createBlockFromMessage,
    _addHMAC
};
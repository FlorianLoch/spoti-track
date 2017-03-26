const expect = require("chai").expect;

const encoder = require("../lib/encoder");
const crypto = require("crypto");

describe("encoder", () => {
    let block;
    const samplePOJSO = {
        artist: "Somebody famoüß",
        album: "Some great älbum",
        title: "Some \\reat\nsöng"
    };

    beforeEach(() => {
        block = encoder._createBlockFromMessage(samplePOJSO);
    });

    describe("_createBlockFromMessage()", () => {
        it("should create blocks having a size which is a multiple of 16 (byte)", () => {
            expect(block).to.be.an.instanceof(Buffer);
            expect(block.length).to.be.equal(57 + 7);
        });

        it("should start with its length", () => {
            const str = block.toString("utf8");
            expect(str).to.match(/^55\nSomebody[\s\S]*$/);
        });

        it("should properly handle encoding", () => {
            const str = block.toString("utf8");
            expect(str).to.contain("\nSome \\\\reat\\nsöng");
        });
    });

    describe("_addHMAC", () => {
        it("should attach exactly 256 bit to block", () => {
            const withHMAC = encoder._addHMAC(block, "MY SECRET KEY");

            expect(withHMAC.length).to.be.equal( /* same as above for message */ 64 + /* 256 bits of HMAC */ 32);
        });
    });

    describe("encodeMessage", () => {
        it("should combine _createBlockFromMessage, _addHMAC - when encrypted is not wanted", () => {
            const withHMAC = encoder._addHMAC(block, "MY SECRET KEY");

            const encoded = encoder.encodeMessage(samplePOJSO, "MY SECRET KEY", false);
            
            expect(withHMAC).to.deep.equal(encoded);
        });

        it("should be like this: encrypted block is 16 Byte longer due to IV added by AES-128-CBC", () => {
            const withHMAC = encoder._addHMAC(block, "MY SECRET KEY");

            const encoded = encoder.encodeMessage(samplePOJSO, "MY SECRET KEY");
            
            console.log(withHMAC.length);
            expect(withHMAC.length + 16).to.be.equal(encoded.length);
        });

        it("encoded block should be equal block after decryption", () => {
            const key = "MY SECRET KEY";
            const encrypted = encoder.encodeMessage(samplePOJSO, key);
            const withHMAC = encoder._addHMAC(block, "MY SECRET KEY");            

            const hashedKey = crypto.createHash("md5").update(Buffer(key, "ascii")).digest();
            const cipher = crypto.createDecipher("aes-128-cbc", hashedKey);

            const decrypted = Buffer.concat([cipher.update(encrypted), cipher.final()]);

            expect(decrypted).to.be.deep.equal(withHMAC);
        });
    });
});
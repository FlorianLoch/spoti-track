const expect = require("chai").expect;

const encoder = require("../lib/encoder");

describe("encoder", () => {
    let block;

    beforeEach(() => {
        block = encoder._createBlockFromMessage({
            artist: "Somebody famoüß",
            album: "Some great älbum",
            title: "Some \\reat\nsöng"
        });
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

            expect(withHMAC.length).to.be.equal(/* same as above for message */ 64 + /* 256 bits of HMAC */ 32);
        });
    });
});
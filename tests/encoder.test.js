const expect = require("chai").expect;

const encoder = require("../lib/encoder");

describe("encoder", () => {
    describe("_createBlockFromMessage()", () => {
        let block;

        beforeEach(() => {
            block = encoder._createBlockFromMessage({
                artist: "Somebody famoüß",
                album: "Some great älbum",
                title: "Some \\reat\nsöng"
            });
        });
        
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
});
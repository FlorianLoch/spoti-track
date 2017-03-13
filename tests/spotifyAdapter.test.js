const adapter = require("../lib/spotifyAdapter");
const expect = require('chai').expect;

console.log(adapter);

describe("spotifyAdapter", () => {

    describe("getCurrentMetadata", () => {
        it("shall fetch a valid pojso", done => {
            adapter.getCurrentMetadata().then(metadata => {
                expect(metadata).to.contain.all.keys(["album", "artist", "title"]);
                done();
            }, err => {
                console.error(err);
            });
        });
    });
});
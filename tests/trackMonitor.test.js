const expect = require("chai").expect;
const sinon = require("sinon");

const TrackMonitor = require("../lib/trackMonitor");

describe("trackMonitor", () => {
    describe("checkForChange", () => {
        let udpServiceSpy;
        let instance;
        let spotifyAdapterStub;

        beforeEach(() => {
            udpServiceSpy = {
                broadcastTrack: sinon.spy()
            };

            instance = new TrackMonitor();

            spotifyAdapterStub = sinon.stub(require("../lib/spotifyAdapter"), "getCurrentMetadata");
            spotifyAdapterStub.onCall(0).returns(new Promise((resolve) => {
                resolve({
                    artist: "Billy Joel",
                    title: "The Longest Time",
                    album: "The Essential Billy Joel"
                });
            }));
            spotifyAdapterStub.onCall(1).returns(new Promise((resolve) => {
                resolve({
                    artist: "Billy Joel",
                    title: "Leningrad",
                    album: "The Essential Billy Joel"
                });
            }));
        });

        after(() => {
            spotifyAdapterStub.restore();
        });

        it("should call udpServiceSpy when track change detected", (done) => {
            instance.checkForChange(udpServiceSpy, () => {
                instance.checkForChange(udpServiceSpy, () => {
                    // Check cal on udpServiceSpy
                    expect(udpServiceSpy.broadcastTrack.calledTwice).to.be.true;
                    expect(udpServiceSpy.broadcastTrack.getCall(0).args[0]).to.contain.all.keys(["artist", "title", "album"]);
                    done();
                });
            });
        });
    });
});
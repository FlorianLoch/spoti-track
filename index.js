#! /usr/bin/env node
const co = require("co");
const colors = require('colors/safe');

const httpService = require("./lib/httpService");
const udpService = require("./lib/udpBroadcastService");
const spotifyAdapter = require("./lib/spotifyAdapter");

co(function* () {
    // TODO load config
    
    yield httpService.start(47000, "0.0.0.0");
    console.log(colors.blue("\n==> Server is running on port 47000 on all interfaces!\n"));

    startMonitoringTrackChange();
});

function startMonitoringTrackChange() {
    let lastTrack;
    
    setTimeout(() => {
        co(chechForChange);
    }, 5E3);

    chechForChange();

    function* chechForChange() {
        const currentTrack = yield spotifyAdapter.getCurrentMetadata();

        if (!areTracksEqual(currentTrack, lastTrack)) {
            lastTrack = currentTrack;
            udpService.broadcastNewTrack(currentTrack);

            console.log(`=> Track changed. Now playing: ${colors.green(currentTrack.title)} from ${colors.green(currentTrack.artist)} on album ${colors.green(currentTrack.album)}.`);
        }
    }

    function areTracksEqual(a, b) {
        return a && b && a.artist === b.artist && a.album === b.album && a.title === b.title;
    }
}
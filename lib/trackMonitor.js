#! /usr/bin/env node
const co = require("co");
const colors = require('colors/safe');

const spotifyAdapter = require("./spotifyAdapter");

class TrackMonitor {
    constructor() {
        this.lastTrack;
    }

    startMonitoringTrackChange(udpService, timeout = 5E3) {    
        setInterval(() => {
            this.checkForChange(udpService);
        }, timeout);

        this.checkForChange(udpService);
    }

    checkForChange(udpService, done = () => {}) {
        const self = this;

        co(function* () {
            const currentTrack = yield spotifyAdapter.getCurrentMetadata();

            if (!areTracksEqual(currentTrack, self.lastTrack)) {
                self.lastTrack = currentTrack;
                udpService.broadcastTrack(currentTrack);

                console.log(`=> Track changed. Now playing: ${colors.green(currentTrack.title)} from ${colors.green(currentTrack.artist)} on album ${colors.green(currentTrack.album)}.`);
            }

            done();
            
            function areTracksEqual(a, b) {
                return a && b && a.artist === b.artist && a.album === b.album && a.title === b.title;
            }
        });
    }
}

module.exports = TrackMonitor;
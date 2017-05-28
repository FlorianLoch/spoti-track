#! /usr/bin/env node
const co = require("co");
const colors = require("colors/safe");

const httpService = require("./lib/httpService");
const UDPBroadcastService = require("./lib/udpBroadcastService");
const trackMonitor = new (require("./lib/trackMonitor"))();

let udpService;

co(function* () {
    // TODO load config
    
    yield httpService.start(47000, "0.0.0.0");
    console.log(colors.blue("\n==> HTTP server is running on port 47000 on all interfaces!"));

    udpService = new UDPBroadcastService(47000, "secret");
    yield udpService.start("0.0.0.0");
    console.log(colors.blue("==> UDP server is running on port 47000 on all interfaces!"));

    trackMonitor.startMonitoringTrackChange(udpService);
});

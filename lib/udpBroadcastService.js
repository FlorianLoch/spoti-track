const dgram = require("dgram");

const encoder = require("./encoder");

const BUF_REQUEST = Buffer.from("request");

class UDPBroadcastService {
    constructor(port, encryptionKey) {
        this.port = port;
        this.encryptionKey = encryptionKey;
        this.latestTackBroadcasted;

        this.server = dgram.createSocket("udp4");

        this.server.on("error", (err) => {
            console.error(`Error caused by UDP server:\n${err.stack}`);
            this.server.close();
        });

        this.server.on("message", (msg, rinfo) => {           
            if (!msg.equals(BUF_REQUEST) || this.latestTackBroadcasted === undefined) {
                return;
            }
            
            console.log(`=> Received datagram requesting current track information from ${rinfo.address}:${rinfo.port}`);
            this.broadcastTrack(this.latestTackBroadcasted);
        });
    }

    start(iface) {
        return new Promise((resolve, reject) => {
            this.server.bind(this.port, iface, () => {
                this.server.setBroadcast(true);
                resolve();        
            });            
        });
    }

    broadcastTrack(track) {
        this.latestTackBroadcasted = track;

        const encoded = encoder.encodeMessage(track, this.encryptionKey);
        
        this.server.send(encoded, this.port, "255.255.255.255");
    }
}

module.exports = UDPBroadcastService;
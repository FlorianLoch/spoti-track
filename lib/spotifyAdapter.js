const as = require("applescript");

const SCRIPT = `
tell application "Spotify"
	set currentAlbum to album of current track as string
	set currentTrack to name of current track as string
	set currentArtist to artist of current track as string
	
	return {currentTrack, currentArtist, currentAlbum}
end tell
`;

function getCurrentMetadata() {
    const prom = applescriptPromise(SCRIPT);
    
    return new Promise((resolve, reject) => {
        prom.then((metadata) => {
            resolve({
                artist: metadata[1],
                album: metadata[2],
                title: metadata[0]
            });
        }, reject);
    });

    function applescriptPromise(script) {
        return new Promise((resolve, reject) => {
            as.execString(script, (err, res) => {
                if (err) {
                    return reject(err);
                }

                resolve(res);
            });
        });
    }
}

module.exports = {
    getCurrentMetadata
};
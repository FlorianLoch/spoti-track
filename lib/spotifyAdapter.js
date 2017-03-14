const as = require("applescript");

const SCRIPT_CURRENT_ARTIST = `
getCurrentlyPlayingTrack()

on getCurrentlyPlayingTrack()
  tell application "Spotify"
    set currentArtist to artist of current track as string
  
    return currentArtist
  end tell
end getCurrentlyPlayingTrack`;

const SCRIPT_CURRENT_TITLE = `
getCurrentlyPlayingTrack()

on getCurrentlyPlayingTrack()
  tell application "Spotify"
    set currentTrack to name of current track as string
  
    return currentTrack
  end tell
end getCurrentlyPlayingTrack`;

const SCRIPT_CURRENT_ALBUM = `
getCurrentlyPlayingTrack()

on getCurrentlyPlayingTrack()
  tell application "Spotify"
    set currentAlbum to album of current track as string
  
    return currentAlbum
  end tell
end getCurrentlyPlayingTrack`;

function getCurrentMetadata() {
    const promArtist = applescriptPromise(SCRIPT_CURRENT_ARTIST);
    const promAlbum = applescriptPromise(SCRIPT_CURRENT_ALBUM);
    const promTrack = applescriptPromise(SCRIPT_CURRENT_TITLE);

    return new Promise((resolve, reject) => {
        Promise.all([promArtist, promAlbum, promTrack]).then(values => {
            resolve({
                artist: values[0],
                album: values[1],
                title: values[2]
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
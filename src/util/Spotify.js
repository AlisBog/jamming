
let accessToken;
let expiresIn;
const client_id = '2cd385ef0f4c48ec95a7808da2488a9f'
const redirectUri = 'https://jamming.surge.sh'
const Spotify = {

    getAccessToken() {

        if(accessToken) {
            return accessToken;
        } else {
            // access token is in the url, we need to parse the url, save the access token in the variable and return the access token
            // check for access token
            const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
            const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

            if(accessTokenMatch && expiresInMatch) {
                accessToken = accessTokenMatch[1];
                expiresIn  = Number(expiresInMatch[1]);
                window.setTimeout(() => accessToken = '', expiresIn * 1000);
                window.history.pushState('Access Token', null, '/'); // This clears the parametrers, allowing to grab a new access token when it expires.
                return accessToken;
            } else {
                // we do not have an access token anywhere. Redirect to spotify authorize 
                window.location = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirectUri}&scope=playlist-modify-public`

            }
        }
    },

    search: async(searchTerm)=> {
        const accessToken = Spotify.getAccessToken();
        const options = {
            method:'GET',
            headers:{
                'Authorization': `Bearer ${accessToken}`
            }
        }
        const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,options);
        const myJson = await response.json();
        if(!myJson.tracks) return [];
        return myJson.tracks.items.map(track => { console.log(track); return ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
        })})
    },

    async savePlaylist(name, trackUris) {
        if(!name || !trackUris.length) return;

        const accessToken = Spotify.getAccessToken();
        const options = {
            getToken: {
                method:'GET',
                headers:{
                    'Authorization': `Bearer ${accessToken}`
                }},
            postName: {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                    },
                body: JSON.stringify({ name: name })
            },
            postUri: {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                    },
                body: JSON.stringify({ uris: trackUris })
            }
        };

        let userId;

        const response = await fetch('https://api.spotify.com/v1/me', options.getToken);
        const jsonResponse = await response.json();
        userId = jsonResponse.id;
        const response_1 = await fetch(`/v1/users/${userId}/playlists`, options.postName);
        const jsonResponse_1 = await response_1.json();
        const playlistId = jsonResponse_1.id;
        return fetch(`/v1/users/${userId}/playlists/${playlistId}/tracks`, options.postUri);
    }
}


export default Spotify

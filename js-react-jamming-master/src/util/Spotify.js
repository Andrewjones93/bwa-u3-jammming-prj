
const CLIENT_ID = '';
//const REDIRECT_URI = 'http://localhost:3000/';
const REDIRECT_URI = 'https://bstofkojam.surge.sh/';
const GET_URL = 'https://accounts.spotify.com/authorize';
const SEARCH_URL = 'https://api.spotify.com/v1/search';
const USER_URL = 'https://api.spotify.com/v1/me';
const USERS_URL = 'https://api.spotify.com/v1/users/';

let accessToken;
let expiresIn;

const Spotify = {
  getAccessToken() {
    // 1st condition: Token is set
    if (accessToken) {
      console.log("1: access token:");
      console.log(accessToken);
      return accessToken;
    }

    // 2nd condition: Token is in URL
    let url = window.location.href;
    accessToken = this.extract(url, "access_token=", "&");
    //accessToken = url.match(/access_token=([^&]*)/);
    if (accessToken) {
      expiresIn = this.extract(url, "expires_in=", "&");
      //accessToken = accessToken.slice(13,access.length + 1);
      //expiresIn = url.match(/expires_in=([^&]*)/);
      //expiresIn = expiresIn[1];
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      console.log(`accessToken: ${accessToken}`);
      console.log(`expiresIn: ${expiresIn}`);
      return accessToken;

    // 3rd condition: retrieve token from Spotify
    //`https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-private&redirect_uri=${spotifyRedirectUrl}&state=${state}`;
    } else {
      window.location.href = `${GET_URL}?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`;
    }
  },

  search(term) {
    let token = this.getAccessToken();
    console.log("search() token:");
    console.log(accessToken);
    return fetch(`${SEARCH_URL}?type=track&q=${term}`,
    {
      headers: {Authorization: 'Bearer ' + token}
    }).then(response => response.json())
      .then(jsonResponse => {
        if (jsonResponse.tracks) {
          return jsonResponse.tracks.items.map(track => {
            return {
              id: track.id,
              name: track.name,
              artist: track.artists[0].name,
              album: track.album.name,
              uri: track.uri
            }
          });

        } else {
          return [];
        }
      });
  },

  savePlaylist(playlistName,trackURIs) {
    if (!trackURIs.length) {
      console.log('No tracks to save.');
      return;
    }
    let token = this.getAccessToken();
    console.log("savePlaylist() token:");
    console.log(accessToken);
    //could not figure out how to get this variable to work
    //let headers = {Authorization: `Bearer ${token}`};

    fetch(`${USER_URL}`,
    {
      headers: {Authorization: `Bearer ${token}`}
    }).then(response => response.json())
    .then(jsonResponse => {
      console.log(jsonResponse);
      let userId = jsonResponse.id;
      return this.createPlaylist(playlistName,trackURIs,userId);
    });
  },

  createPlaylist(playlistName,trackURIs,userId) {
    let token = this.getAccessToken();
    console.log(`userId: ${userId}`);
    fetch(`${USERS_URL}${userId}/playlists`,
    {
      headers: {Authorization: `Bearer ${token}`},
      method: 'POST',
      body: JSON.stringify({name: playlistName, public: true})
    }).then(response => response.json())
    .then(jsonResponse => {
      console.log(jsonResponse);
      let playlistId = jsonResponse.id;
      return this.savePlaylistTracks(userId,trackURIs,playlistId);
    });
  },

  savePlaylistTracks(userId,trackURIs,playlistId) {
    let token = this.getAccessToken();
    console.log(`userId: ${userId}`);
    return fetch(`${USERS_URL}${userId}/playlists/${playlistId}/tracks`,
    {
      headers: {Authorization: `Bearer ${token}`},
      method: 'POST',
      body: JSON.stringify(trackURIs)
    }).then(response => response.json())
    .then(jsonResponse => {
      console.log(jsonResponse);
      //let playlistId = jsonResponse.id;

    });
  },

  // Shamelessly found this method online to parse my regular expression
  extract(string, keyword, limiter) {
    let startIndex = string.indexOf(keyword);
    if (startIndex !== -1) {
        // add the length of the keyword to the start position to get the "real" start
        startIndex += keyword.length;
        let endIndex = string.indexOf(limiter, startIndex);
        if (endIndex !== -1) {
            return string.slice(startIndex, endIndex);
        } else {
            return string.slice(startIndex);
        }
    }
    return undefined;
  }
}

export default Spotify;

/*
$.ajax({
  url: `https://api.spotify.com/v1/search?type=track&q=${term}`,
  type: 'GET',
  dataType: 'json',
  headers: {
    'Authorization': 'Bearer ' + accessToken
  },
  success(response) {
    JSON.parse(response);
    console.log('Response: ');
    console.log(response.length);
    console.log(response);
    return response.track.map(track => ({
      ID: track.id,
      Name: track.name,
      Artist: track.artists[0].name,
      Album: track.album.name,
      URI: track.uri
    }));
  },
  error(jqXHR,status,errorThrown) {
    console.log('Error: ');
    console.log(jqXHR);
  }
});
*/

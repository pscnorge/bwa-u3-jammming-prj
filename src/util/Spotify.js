let accessToken;
const clientId = "15d15b03a6fc42239fed799c7fa33b97";
const redirectURI = "http://peta_jammming.surge.sh";

let Spotify = {
  
  getAccessToken() {
    if (!accessToken) {
      if (window.location.href.match(/access_token=([^&]*)/)) {
        accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
        let expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
        return accessToken;
      } else {
        window.location = "https://accounts.spotify.com/authorize?client_id=" + clientId + "&response_type=token&scope=playlist-modify-public&redirect_uri=" + redirectURI;
      }      
    } else {
      return accessToken;
    }
  },
  
  search(term) {
    accessToken = Spotify.getAccessToken();
    return fetch(
      "https://api.spotify.com/v1/search?type=track&q=" + term,
      {headers: {Authorization: "Bearer " + Spotify.getAccessToken()}}
    ).then(response => {
      return response.json();
      }      
    ).then(jsonResponse => {
      if (jsonResponse.tracks) {
        return jsonResponse.tracks.items.map(track => {
          return {
            id: track.id,
            uri: track.uri,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
          };
        });
      } else {
        return [];
      }
      }      
    )
    ;
  },
  
  savePlaylist(playlist, trackURIs) {
    if (playlist && trackURIs) {
      accessToken = Spotify.getAccessToken();
      let headers = {Authorization: "Bearer " + accessToken};
      let userId;
      let playlistId;
      
      return fetch(
        "https://api.spotify.com/v1/me",
        {headers: headers}
      ).then(response => {return response.json();}      
      ).then(jsonResponse => {
        userId = jsonResponse.id;
        return fetch (
          "https://api.spotify.com/v1/users/" + userId + "/playlists",
          {headers: 
            headers,
            method: 'POST',
            body: JSON.stringify({name: playlist})
          }
        ).then(response => {return response.json();}
        ).then(jsonResponse => {
            playlistId = jsonResponse.id;
            return fetch (
              "https://api.spotify.com/v1/users/" + userId + "/playlists/" + playlistId + "/tracks",
              {headers: 
                headers,
                method: 'POST',
                body: JSON.stringify({uris: trackURIs})
              }
            );
        } 
        );
      });
      
    } else {
      return;
    }
  }
  
};

export default Spotify;

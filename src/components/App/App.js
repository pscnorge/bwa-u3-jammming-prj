import React, { Component } from 'react';
import Spotify from '../../util/Spotify.js';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import PlayList from '../PlayList/PlayList.js';
import './App.css';

Spotify.getAccessToken(); //clumsy fix for 401 & window refresh on search

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []      
      };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  
  addTrack(track) {
    let trackInPlayList = false;
    this.state.playlistTracks.forEach(playlistTrack => {
      if (playlistTrack.id === track.id) {
        trackInPlayList = true;
      }
    }
    );
      if (!trackInPlayList) {
        let updatedPlaylist = this.state.playlistTracks;
        updatedPlaylist.push(track);
        this.setState({playlistTracks: updatedPlaylist});
      }
  }
  
  removeTrack(track) {    
    let updatedPlaylist = this.state.playlistTracks.filter(playlistTrack => {
      return playlistTrack.id !== track.id;
    });
    this.setState({playlistTracks: updatedPlaylist});
  }
  
  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }
  
  savePlaylist() {
    let trackURIs = [];
    this.state.playlistTracks.forEach(playlistTrack => {
      trackURIs.push(playlistTrack.uri);
    });
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({playlistTracks:[], playlistName: 'New Playlist', searchResults:[]});
  }
  
  search(term) {
    Spotify.search(term).then(tracks => this.setState({searchResults: tracks}));
  }
  
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <PlayList 
              playlistName={this.state.playlistName} 
              playlistTracks={this.state.playlistTracks} 
              onRemove={this.removeTrack} 
              onNameChange={this.updatePlaylistName} 
              onSave={this.savePlaylist} 
              />
          </div>
        </div>
      </div>      
    ); 
  }
}

export default App;

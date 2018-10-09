import React from 'react';
import './SearchResults.css';
import TrackList from '../TrackList/TrackList';

class SearchResults extends React.Component {
  render() {
    return (
      <div className="SearchResults">
        <h2>Results</h2>
        <TrackList tracks={this.props.searchResults} onAdd={this.props.onAdd} isRemoval={false}/>

      </div>
    );
  }
}

export default SearchResults;

/*
{console.log("this.props.searchResults: ")}
{console.log(this.props.searchResults)}

<TrackList tracks={this.props.searchResults}/>
{this.props.searchResults[0].name}

{this.props.searchResults[0].name}
{this.props.searchResults[0].name}
{this.props.searchResults[0].artist}
{this.props.searchResults[0].album}
<br/>
{this.props.searchResults[1].name}
{this.props.searchResults[1].artist}
{this.props.searchResults[1].album}
*/

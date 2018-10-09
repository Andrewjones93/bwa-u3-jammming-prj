import React from 'react';
import './SearchBar.css'

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      term: 'default'
    }

    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }

  search(event) {
    event.preventDefault();
    return this.props.onSearch(this.state.term);
  }

  handleTermChange(event) {
    const term = event.target.value;
    this.setState({
      term: term
    });
  }

  render() {
    return (
      <div className="SearchBar">
        <form onSubmit={this.search}>
          <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} />
          &nbsp;&nbsp;<button>SEARCH</button>
        </form>
      </div>
    );
  }
}

export default SearchBar;

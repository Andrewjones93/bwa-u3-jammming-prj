import React from 'react';

class List extends React.Component {
  render() {
    let titleText = `Children of state: ${this.props.type}`;
    if (this.props.results instanceof Array) {
        titleText += 's';
    }
    return (
      <div>
        <h2>{titleText}</h2>
        <ul>{this.props.results}</ul>
      </div>
    );
  }
}

export default List;

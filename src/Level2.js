import React, { Component } from 'react';
import Major from './Major'

/*
Keep numbers 00 to 99 with pegs shuffled in bucket 0.
Show n (e.g. 5) items from bucket 0, each for a duration of t (e.g. 3) seconds.
Recall those numbers in sequence. Time limit???
Add successful items to bucket 1, while keeping failing items at bucket 0.
Continue until bucket 0 is empty.
*/

function Card(props) {
  return (
    <div className="ui centered card">
      <div
        className="ui center aligned header"
        style={{fontSize: 48 + 'px'}}
      >
        {props.number}
      </div>
      <div className="content">
        <a className="ui center aligned header">
          {props.peg}
        </a>
      </div>
    </div>
  );
}

class Level2 extends Component {
  render() {
    const item = Major[0];
    return(
      <div className="ui container">
        <Card number={item.number} peg={item.peg} />
      </div>
    );
  }
}

export default Level2;

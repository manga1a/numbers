import React, { Component } from 'react';
import { Link } from 'react-router-dom';

//<a className="active item"><Link to="/level-one">Level One</Link></a>

class App extends Component {
  render() {
    return (
      <div className="ui grid">
        <div className="four wide column">
          <div className="ui vertical fluid tabular menu">
            <div className="item"><Link to="/level-one">Level One</Link></div>
            <div className="item"><Link to="/level-two">Level Two</Link></div>
            <div className="item"><Link to="/level-three">Level Three</Link></div>
          </div>
        </div>
        <div className="twelve wide stretched column">
          <div className="ui segment">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default App;

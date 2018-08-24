import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Paths from '../utils/Paths';

class App extends Component {
  render() {
    function getItemClass(linkName) {
        if(linkName === window.location.pathname) {
          return "active item";
        } else {
          return "item";
        }
    }

    return (
      <div className="ui grid">
        <div className="four wide column">
          <div className="ui vertical fluid tabular menu">
            <div className={getItemClass(Paths.one)}><Link to={Paths.one}>Level One</Link></div>
            <div className={getItemClass(Paths.two)}><Link to={Paths.two}>Level Two</Link></div>
            <div className={getItemClass(Paths.three)}><Link to={Paths.three}>Level Three</Link></div>
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

import React, { Component } from 'react';

import LevelOne from './levels/Level1';
import LevelTwo from './levels/Level2';
import NumPad from './common/NumPad';

class App extends Component {
  render(){
    return (
      <NumPad onButton={(id) => {console.log(id);}}/>
    );
  }
}

export default App;

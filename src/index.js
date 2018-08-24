import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
import { render } from 'react-dom';
//import {Router, Route} from 'react-router';
import { BrowserRouter, Route } from 'react-router-dom';

import './index.css';
import registerServiceWorker from './registerServiceWorker';

import App from './components/App';
import LevelOne from './components/levels/Level1';
import LevelTwo from './components/levels/Level2';
import LevelThree from './components/levels/Level3';

render(
    <BrowserRouter>
      <App>
        <Route path="/level-one" component={LevelOne}/>
        <Route path="/level-two" component={LevelTwo}/>
        <Route path="/level-three" component={LevelThree}/>
      </App>
    </BrowserRouter>,
    document.getElementById('content')
);

registerServiceWorker();

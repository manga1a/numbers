import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Level1 from './Level1';
import registerServiceWorker from './registerServiceWorker';

//ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<Level1 />, document.getElementById('root'));
registerServiceWorker();

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Level1 from './Level1';
import Level2 from './Level2';
import registerServiceWorker from './registerServiceWorker';

//ReactDOM.render(<Level1 />,
ReactDOM.render(<Level2 />,
  document.getElementById('content'));
registerServiceWorker();

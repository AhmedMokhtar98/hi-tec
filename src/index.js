import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom'
import Context from './Context/Context';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Context>
        <App />
      </Context>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
reportWebVitals();

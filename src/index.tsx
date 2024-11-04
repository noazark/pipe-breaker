import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import registerServiceWorker from './registerServiceWorker.js';

const $el = document.getElementById('root');

if (!$el) {
  throw new Error('Root element not found, check it exists in index.html');
}

const root = ReactDOM.createRoot($el);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
registerServiceWorker();

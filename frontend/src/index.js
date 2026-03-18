import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Signal to public/index.html that React has mounted successfully.
// This hides the loading screen only after React renders at least once.
requestAnimationFrame(() => {
  window.dispatchEvent(new Event('react-app-mounted'));
});

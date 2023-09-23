import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/layout/App.tsx';
import 'semantic-ui-css/semantic.min.css';
import './app/layout/styles.css';

const rootElement: HTMLElement = document.getElementById('root')!;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import 'semantic-ui-css/semantic.min.css';

const rootElement: HTMLElement = document.getElementById('root')!;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { StoreContext, store } from './app/stores/store.ts';
import { router } from './app/router/Routes.tsx';
import 'semantic-ui-css/semantic.min.css';
import './app/layout/styles.css';

const rootElement: HTMLElement = document.getElementById('root')!;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
      <RouterProvider router={router} />
    </StoreContext.Provider>
  </React.StrictMode>,
);

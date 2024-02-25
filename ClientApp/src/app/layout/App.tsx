import { FC } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Container } from 'semantic-ui-react';
import { ToastContainer } from 'react-toastify';

import HomePage from '../../features/home/HomePage';
import NavBar from './NavBar';

const App: FC = observer(() => {
  const location = useLocation();

  return (
    <>
      <ToastContainer
        hideProgressBar
        theme="colored"
        position="bottom-right"
      />

      {location.pathname === '/' ? (
        <HomePage />
      ) : (
        <>
          <NavBar />

          <Container style={{ marginTop: '6rem' }}>
            <Outlet />
          </Container>
        </>
      )}
    </>
  );
});

App.displayName = 'App';

export default App;

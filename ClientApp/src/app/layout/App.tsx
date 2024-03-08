import { FC, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Container } from 'semantic-ui-react';
import { ToastContainer } from 'react-toastify';

import NavBar from './NavBar';
import Loader from './Loader';
import { useStore } from '../stores/store';
import HomePage from '../../features/home/HomePage';

const App: FC = () => {
  const location = useLocation();

  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(commonStore.setAppLoaded);
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore]);

  if (!commonStore.appLoaded) {
    return <Loader content="Loading activities..." />;
  }

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
};

App.displayName = 'App';

export default observer(App);

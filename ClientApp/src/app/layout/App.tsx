import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';

const App: FC = observer(() => {
  return (
    <>
      <NavBar />

      <Container style={{ marginTop: '6rem' }}>
        <Outlet />
      </Container>
    </>
  );
});

App.displayName = 'App';

export default App;

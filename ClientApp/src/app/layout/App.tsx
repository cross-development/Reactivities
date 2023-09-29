import { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import Loader from './Loader';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { useStore } from '../stores/store';

const App: FC = observer(() => {
  const { activityStore } = useStore();

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.isInitialLoading) {
    return <Loader content="Loading App" />;
  }

  return (
    <>
      <NavBar />

      <Container style={{ marginTop: '6rem' }}>
        <ActivityDashboard />
      </Container>
    </>
  );
});

App.displayName = 'App';

export default App;

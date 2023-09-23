import { FC, memo, useCallback, useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import NavBar from './NavBar';
import { Activity } from '../models/activity';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';

const App: FC = memo(() => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity>();

  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5000/api/activities').then(res => {
      setActivities(res.data);
    });
  }, []);

  const handleSelectActivity = useCallback(
    (id: string): void => setSelectedActivity(activities.find(a => a.id === id)),
    [activities],
  );

  const handleCancelSelectActivity = useCallback((): void => setSelectedActivity(undefined), []);

  const handleOpenForm = useCallback(
    (id?: string): void => {
      id ? handleSelectActivity(id) : handleCancelSelectActivity();

      setIsEditMode(true);
    },
    [handleCancelSelectActivity, handleSelectActivity],
  );

  const handleCloseForm = useCallback((): void => setIsEditMode(false), []);

  const handleCreateOrEditActivity = useCallback((activity: Activity): void => {
    activity.id
      ? setActivities(prevState => prevState.filter(a => a.id !== activity.id))
      : setActivities(prevState => [...prevState, { ...activity, id: uuid() }]);

    setIsEditMode(false);
    setSelectedActivity(activity);
  }, []);

  const handleDeleteActivity = useCallback((id: string): void => {
    setActivities(prevState => prevState.filter(a => a.id !== id));
  }, []);

  return (
    <>
      <NavBar onOpenForm={handleOpenForm} />

      <Container style={{ marginTop: '6rem' }}>
        <ActivityDashboard
          activities={activities}
          isEditMode={isEditMode}
          selectedActivity={selectedActivity}
          onOpenForm={handleOpenForm}
          onCloseForm={handleCloseForm}
          onSelectActivity={handleSelectActivity}
          onDeleteActivity={handleDeleteActivity}
          onCancelSelectActivity={handleCancelSelectActivity}
          onCreateOrEditActivity={handleCreateOrEditActivity}
        />
      </Container>
    </>
  );
});

App.displayName = 'App';

export default App;

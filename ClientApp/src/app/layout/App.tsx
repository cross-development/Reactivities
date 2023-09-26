import { FC, memo, useCallback, useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import NavBar from './NavBar';
import Loader from './Loader';
import { Activity } from '../models/activity';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import agent from '../api/agent';

const App: FC = memo(() => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity>();

  useEffect(() => {
    agent.Activities.list().then(data => {
      const activities: Activity[] = data.map(a => ({ ...a, date: a.date.split('T')[0] }));

      setActivities(activities);
      setIsLoading(false);
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

  const handleCreateOrEditActivity = useCallback(async (activity: Activity): Promise<void> => {
    setIsSubmitting(true);

    if (activity.id) {
      await agent.Activities.update(activity);

      setActivities(prevState => prevState.filter(a => a.id !== activity.id));
    } else {
      activity.id = uuid();

      await agent.Activities.create(activity);

      setActivities(prevState => [...prevState, activity]);
    }

    setSelectedActivity(activity);
    setIsSubmitting(false);
    setIsEditMode(false);
  }, []);

  const handleDeleteActivity = useCallback(async (id: string): Promise<void> => {
    setIsSubmitting(true);

    await agent.Activities.delete(id);

    setActivities(prevState => prevState.filter(a => a.id !== id));
    setIsSubmitting(false);
  }, []);

  if (isLoading) {
    return <Loader content="Loading App" />;
  }

  return (
    <>
      <NavBar onOpenForm={handleOpenForm} />

      <Container style={{ marginTop: '6rem' }}>
        <ActivityDashboard
          activities={activities}
          isEditMode={isEditMode}
          isSubmitting={isSubmitting}
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

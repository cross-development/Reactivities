import { FC, memo, useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Container } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import NavBar from './NavBar';
import Loader from './Loader';
import { Activity } from '../models/activity';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { useStore } from '../stores/store';
import agent from '../api/agent';

const App: FC = memo(() => {
  const { activityStore } = useStore();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity>();

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

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

  if (activityStore.isInitialLoading) {
    return <Loader content="Loading App" />;
  }

  return (
    <>
      <NavBar onOpenForm={handleOpenForm} />

      <Container style={{ marginTop: '6rem' }}>
        <ActivityDashboard
          activities={activityStore.activities}
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

export default observer(App);

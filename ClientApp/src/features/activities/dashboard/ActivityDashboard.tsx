import { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Grid } from 'semantic-ui-react';

import ActivityList from './ActivityList';
import ActivityFilters from './ActivityFilters';
import Loader from '../../../app/layout/Loader';
import { useStore } from '../../../app/stores/store';

const ActivityDashboard: FC = observer(() => {
  const {
    activityStore: { loadActivities, isInitialLoading, activityRegistry },
  } = useStore();

  useEffect(() => {
    if (activityRegistry.size <= 1) {
      loadActivities();
    }
  }, [activityRegistry.size, loadActivities]);

  if (isInitialLoading) {
    return <Loader content="Loading App" />;
  }

  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityList />
      </Grid.Column>

      <Grid.Column width="6">
        <ActivityFilters />
      </Grid.Column>
    </Grid>
  );
});

ActivityDashboard.displayName = 'ActivityDashboard';

export default ActivityDashboard;

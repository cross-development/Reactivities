import { FC } from 'react';
import { Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import ActivityList from './ActivityList';
import ActivityForm from '../form/ActivityForm';
import ActivityDetails from '../details/ActivityDetails';
import { useStore } from '../../../app/stores/store';

const ActivityDashboard: FC = observer(() => {
  const { activityStore } = useStore();

  const { selectedActivity, isEditMode } = activityStore;

  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityList />
      </Grid.Column>

      <Grid.Column width="6">
        {selectedActivity && !isEditMode && <ActivityDetails />}

        {isEditMode && <ActivityForm />}
      </Grid.Column>
    </Grid>
  );
});

ActivityDashboard.displayName = 'ActivityDashboard';

export default ActivityDashboard;

import { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';

import Loader from '../../../app/layout/Loader';
import { useStore } from '../../../app/stores/store';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';

const ActivityDetails: FC = observer(() => {
  const {
    activityStore: { selectedActivity, isInitialLoading, loadActivity, clearSelectedActivity },
  } = useStore();

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      loadActivity(id);
    }

    return () => {
      clearSelectedActivity();
    };
  }, [id, loadActivity, clearSelectedActivity]);

  if (isInitialLoading || !selectedActivity) {
    return <Loader />;
  }

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHeader activity={selectedActivity} />

        <ActivityDetailedInfo activity={selectedActivity} />

        <ActivityDetailedChat activityId={selectedActivity.id} />
      </Grid.Column>

      <Grid.Column width={6}>
        <ActivityDetailedSidebar activity={selectedActivity} />
      </Grid.Column>
    </Grid>
  );
});

ActivityDetails.displayName = 'ActivityDetails';

export default ActivityDetails;

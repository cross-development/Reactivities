import { FC, memo } from 'react';
import { Grid } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import ActivityForm from '../form/ActivityForm';
import ActivityDetails from '../details/ActivityDetails';
import { Activity } from '../../../app/models/activity';

interface Props {
  activities: Activity[];
  selectedActivity?: Activity;
  isEditMode: boolean;
  isSubmitting: boolean;
  onOpenForm: (id: string) => void;
  onCloseForm: () => void;
  onSelectActivity: (id: string) => void;
  onDeleteActivity: (id: string) => void;
  onCancelSelectActivity: () => void;
  onCreateOrEditActivity: (activity: Activity) => void;
}

const ActivityDashboard: FC<Props> = memo(props => {
  const {
    activities,
    isEditMode,
    isSubmitting,
    selectedActivity,
    onOpenForm,
    onCloseForm,
    onSelectActivity,
    onDeleteActivity,
    onCancelSelectActivity,
    onCreateOrEditActivity,
  } = props;

  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityList
          activities={activities}
          isSubmitting={isSubmitting}
          onSelectActivity={onSelectActivity}
          onDeleteActivity={onDeleteActivity}
        />
      </Grid.Column>

      <Grid.Column width="6">
        {selectedActivity && !isEditMode && (
          <ActivityDetails
            activity={selectedActivity}
            onOpenForm={onOpenForm}
            onCancelSelectActivity={onCancelSelectActivity}
          />
        )}

        {isEditMode && (
          <ActivityForm
            isSubmitting={isSubmitting}
            selectedActivity={selectedActivity}
            onCloseForm={onCloseForm}
            onCreateOrEditActivity={onCreateOrEditActivity}
          />
        )}
      </Grid.Column>
    </Grid>
  );
});

ActivityDashboard.displayName = 'ActivityDashboard';

export default ActivityDashboard;

import { FC, memo } from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';

const ActivityDetails: FC = memo(() => {
  const {
    activityStore: { selectedActivity, openForm, cancelSelectedActivity },
  } = useStore();

  if (!selectedActivity) {
    return null;
  }

  return (
    <Card fluid>
      <Image src={`/assets/categoryImages/${selectedActivity.category}.jpg`} />

      <Card.Content>
        <Card.Header>{selectedActivity.title}</Card.Header>

        <Card.Meta>
          <span>{selectedActivity.date}</span>
        </Card.Meta>

        <Card.Description>{selectedActivity.description}</Card.Description>
      </Card.Content>

      <Card.Content extra>
        <Button.Group widths="2">
          <Button
            basic
            color="blue"
            content="Edit"
            onClick={() => openForm(selectedActivity.id)}
          />
          <Button
            basic
            color="grey"
            content="Cancel"
            onClick={cancelSelectedActivity}
          />
        </Button.Group>
      </Card.Content>
    </Card>
  );
});

ActivityDetails.displayName = 'ActivityDetails';

export default ActivityDetails;

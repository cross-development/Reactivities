import { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, Image } from 'semantic-ui-react';

import { useStore } from '../../../app/stores/store';
import Loader from '../../../app/layout/Loader';

const ActivityDetails: FC = () => {
  const {
    activityStore: { selectedActivity, isInitialLoading, loadActivity },
  } = useStore();

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      loadActivity(id);
    }
  }, [id, loadActivity]);

  if (isInitialLoading || !selectedActivity) {
    return <Loader />;
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
            to={`/manage/${selectedActivity.id}`}
            as={Link}
          />
          <Button
            basic
            color="grey"
            content="Cancel"
            to="activities"
            as={Link}
          />
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

ActivityDetails.displayName = 'ActivityDetails';

export default observer(ActivityDetails);

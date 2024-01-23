import { FC, MouseEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Button, Item, Label, Segment } from 'semantic-ui-react';

import { useStore } from '../../../app/stores/store';

const ActivityList: FC = observer(() => {
  const [target, setTarget] = useState<string>('');

  const { activityStore } = useStore();

  const { deleteActivity, activitiesByDate, isLoading } = activityStore;

  const handleActivityDelete = (e: MouseEvent<HTMLButtonElement>, id: string): void => {
    setTarget(e.currentTarget.name);

    deleteActivity(id);
  };

  return (
    <Segment>
      <Item.Group divided>
        {activitiesByDate.map(({ id, category, city, date, description, title, venue }) => (
          <Item key={id}>
            <Item.Content>
              <Item.Header as="a">{title}</Item.Header>

              <Item.Meta>{date}</Item.Meta>

              <Item.Description>
                <div>{description}</div>
                <div>
                  {city}, {venue}
                </div>
              </Item.Description>

              <Item.Extra>
                <Button
                  floated="right"
                  content="View"
                  color="blue"
                  to={`/activities/${id}`}
                  as={Link}
                />

                <Button
                  name={id}
                  floated="right"
                  content="Delete"
                  color="red"
                  loading={isLoading && target === id}
                  onClick={e => handleActivityDelete(e, id)}
                />

                <Label
                  basic
                  content={category}
                />
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
});

ActivityList.displayName = 'ActivityList';

export default ActivityList;

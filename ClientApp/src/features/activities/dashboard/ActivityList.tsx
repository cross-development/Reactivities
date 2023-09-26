import { FC, MouseEvent, memo, useState } from 'react';
import { Button, Item, Label, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';

interface Props {
  isSubmitting: boolean;
  activities: Activity[];
  onSelectActivity: (id: string) => void;
  onDeleteActivity: (id: string) => void;
}

const ActivityList: FC<Props> = memo(props => {
  const { isSubmitting, activities, onSelectActivity, onDeleteActivity } = props;

  const [target, setTarget] = useState<string>('');

  const handleActivityDelete = (e: MouseEvent<HTMLButtonElement>, id: string): void => {
    setTarget(e.currentTarget.name);

    onDeleteActivity(id);
  };

  return (
    <Segment>
      <Item.Group divided>
        {activities.map(({ id, category, city, date, description, title, venue }) => (
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
                  onClick={() => onSelectActivity(id)}
                />

                <Button
                  name={id}
                  floated="right"
                  content="Delete"
                  color="red"
                  loading={isSubmitting && target === id}
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

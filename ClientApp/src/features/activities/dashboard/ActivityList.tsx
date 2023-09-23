import { FC, memo } from 'react';
import { Button, Item, Label, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';

interface Props {
  activities: Activity[];
  onSelectActivity: (id: string) => void;
  onDeleteActivity: (id: string) => void;
}

const ActivityList: FC<Props> = memo(({ activities, onSelectActivity, onDeleteActivity }) => {
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
                  floated="right"
                  content="Delete"
                  color="red"
                  onClick={() => onDeleteActivity(id)}
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

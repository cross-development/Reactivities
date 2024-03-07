import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Item, Segment } from 'semantic-ui-react';
import { format } from 'date-fns';

import { Activity } from '../../../app/models/activity';

interface Props {
  activity: Activity;
}

const ActivityListItem: FC<Props> = ({ activity }) => (
  <Segment.Group>
    <Segment>
      <Item.Group>
        <Item>
          <Item.Image
            circular
            size="tiny"
            src="/assets/user.png"
          />

          <Item.Content>
            <Item.Header
              as={Link}
              to={`/activities/${activity.id}`}
            >
              {activity.title}
            </Item.Header>

            <Item.Description>Hosted by Bob</Item.Description>
          </Item.Content>
        </Item>
      </Item.Group>
    </Segment>

    <Segment>
      <span>
        <Icon name="clock" /> {format(activity.date!, 'dd MMM yyyy h:mm aa')}
        <Icon name="marker" /> {activity.venue}
      </span>
    </Segment>

    <Segment secondary>Attendees go here</Segment>

    <Segment clearing>
      <span>{activity.description}</span>

      <Button
        as={Link}
        to={`/activities/${activity.id}`}
        color="teal"
        floated="right"
        content="View"
      />
    </Segment>
  </Segment.Group>
);

ActivityListItem.displayName = 'ActivityListItem';

export default ActivityListItem;
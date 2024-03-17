import { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Item, Label, Segment } from 'semantic-ui-react';
import { format } from 'date-fns';

import { IActivity } from '../../../app/models/activity';
import ActivityListItemAttendee from './ActivityListItemAttendee';

interface Props {
  activity: IActivity;
}

const ActivityListItem: FC<Props> = memo(({ activity }) => (
  <Segment.Group>
    <Segment>
      {activity.isCanceled && (
        <Label
          color="red"
          attached="top"
          content="Canceled"
          style={{ textAlign: 'center' }}
        />
      )}

      <Item.Group>
        <Item>
          <Item.Image
            circular
            size="tiny"
            src={activity.host?.image || '/assets/user.png'}
            style={{ marginBottom: 5 }}
          />

          <Item.Content>
            <Item.Header
              as={Link}
              to={`/activities/${activity.id}`}
            >
              {activity.title}
            </Item.Header>

            <Item.Description>
              Hosted by{' '}
              <Link to={`/profiles/${activity.hostUsername}`}>{activity.host?.displayName}</Link>
            </Item.Description>

            {activity.isHost && (
              <Item.Description>
                <Label
                  basic
                  color="orange"
                >
                  You are hosting this activity
                </Label>
              </Item.Description>
            )}

            {activity.isGoing && !activity.isHost && (
              <Item.Description>
                <Label
                  basic
                  color="green"
                >
                  You are going to this activity
                </Label>
              </Item.Description>
            )}
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

    <Segment secondary>
      <ActivityListItemAttendee attendees={activity.attendees} />
    </Segment>

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
));

ActivityListItem.displayName = 'ActivityListItem';

export default ActivityListItem;

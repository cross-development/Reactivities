import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Segment, List, Label, Item, Image } from 'semantic-ui-react';

import { IActivity } from '../../../app/models/activity';

interface Props {
  activity: IActivity;
}

const ActivityDetailedSidebar: FC<Props> = observer(({ activity }) => {
  if (!activity.attendees) {
    return null;
  }

  return (
    <>
      <Segment
        inverted
        secondary
        color="teal"
        attached="top"
        textAlign="center"
        style={{ border: 'none' }}
      >
        {activity.attendees.length} {activity.attendees.length === 1 ? 'Person' : 'People'} going
      </Segment>

      <Segment attached>
        <List
          relaxed
          divided
        >
          {activity.attendees.map(attendee => (
            <Item
              key={attendee.username}
              style={{ position: 'relative' }}
            >
              {attendee.username === activity.host?.username && (
                <Label
                  color="orange"
                  ribbon="right"
                  style={{ position: 'absolute' }}
                >
                  Host
                </Label>
              )}

              <Image
                size="tiny"
                src={attendee.image || '/assets/user.png'}
              />

              <Item.Content verticalAlign="middle">
                <Item.Header as="h3">
                  <Link to={`/profile/${attendee.username}`}>{attendee.displayName}</Link>
                </Item.Header>

                {attendee.following && (
                  <Item.Extra style={{ color: 'orange' }}>Following</Item.Extra>
                )}
              </Item.Content>
            </Item>
          ))}
        </List>
      </Segment>
    </>
  );
});

ActivityDetailedSidebar.displayName = 'ActivityDetailedSidebar';

export default ActivityDetailedSidebar;
